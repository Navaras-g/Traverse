import hashlib
import json

from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.redis_client import redis_client
from app.models.listing import Listing
from app.schemas.itinerary import ItineraryResponse
from app.services.llm import client

CACHE_TTL_SECONDS = 60 * 60  # 1 hour


def _cache_key(listing_ids: list[str], notes: str | None) -> str:
    raw = "|".join(sorted(listing_ids)) + f"|{notes or ''}"
    digest = hashlib.sha256(raw.encode()).hexdigest()
    return f"itinerary:{digest}"


def _build_prompt(listings: list[Listing], notes: str | None) -> str:
    listing_lines = "\n".join(
        f"- id: {l.id} | {l.title} in {l.city}, {l.region} | style: {l.trip_style} | "
        f"${l.price_per_night:.0f}/night | rating {l.rating}/5 | {l.description}"
        for l in listings
    )
    preference_line = f"\nTraveler's stated preferences: {notes}" if notes else ""

    return f"""You are a Nepal travel expert writing a personalized itinerary.

Here are the selected stops, in no particular order:
{listing_lines}
{preference_line}

Arrange these into a logical day-by-day itinerary (one stop per day, in the order that
makes the most geographic and narrative sense). For each day, write a short, warm,
specific 2-3 sentence narrative explaining why this stop fits the traveler, referencing
real details from the listing rather than generic filler.

Respond with ONLY valid JSON, no markdown fences, no preamble, in exactly this shape:
{{
  "trip_title": "string",
  "intro": "1-2 sentence overview of the whole trip",
  "days": [
    {{"day_number": 1, "heading": "short title", "narrative": "2-3 sentences", "listing_id": "the listing id"}}
  ]
}}
"""


def generate_itinerary(db: Session, listing_ids: list[str], notes: str | None) -> ItineraryResponse:
    cache_key = _cache_key(listing_ids, notes)
    cached = redis_client.get(cache_key)
    if cached:
        return ItineraryResponse(**json.loads(cached), cached=True)

    listings = db.query(Listing).filter(Listing.id.in_(listing_ids)).all()
    if not listings:
        raise ValueError("No matching listings found for the given ids")

    prompt = _build_prompt(listings, notes)

    response = client.chat.completions.create(
        model=settings.groq_model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )
    raw_text = response.choices[0].message.content.strip()

    # Defensive cleanup in case the model wraps output in markdown fences anyway
    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")
        if raw_text.lower().startswith("json"):
            raw_text = raw_text[4:]
        raw_text = raw_text.strip()

    parsed = json.loads(raw_text)  # raises if the model didn't return valid JSON
    result = ItineraryResponse(**parsed, cached=False)

    redis_client.setex(cache_key, CACHE_TTL_SECONDS, result.model_dump_json(exclude={"cached"}))
    return result