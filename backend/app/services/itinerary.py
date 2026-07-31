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

Decide the total number of days for this trip primarily from any duration the traveler
mentions in their preferences above (e.g. "3 day itinerary", "visit in 2 days"). If no
duration is mentioned, default to one day per stop.

Stops do not need a strict one-to-one mapping to days:
- If there are fewer days than stops, combine multiple stops into the same day where it
  makes geographic sense (e.g. two nearby heritage sites in one day).
- If there are more days than stops, let a single stop span multiple consecutive days
  (e.g. a multi-day base for trekking or rest), and vary each day's narrative so it
  doesn't just repeat itself — describe a different facet of that stop or a nearby
  activity each day.
- Every listing id provided must appear on at least one day somewhere in the itinerary.

For each day, write a short, warm, specific 2-3 sentence narrative explaining what makes
that day worthwhile, referencing real details from the listing(s) rather than generic filler.

Respond with ONLY valid JSON, no markdown fences, no preamble, in exactly this shape:
{{
  "trip_title": "string",
  "intro": "1-2 sentence overview of the whole trip",
  "days": [
    {{"day_number": 1, "heading": "short title", "narrative": "2-3 sentences", "listing_ids": ["one or more listing ids covered that day"]}}
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