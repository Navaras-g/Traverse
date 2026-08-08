import hashlib
import json

from app.core.config import settings
from app.db.redis_client import redis_client
from app.models.listing import Listing
from app.services.llm import client

CACHE_TTL_SECONDS = 60 * 60


def make_cache_key(listing_ids: list[str], notes: str | None) -> str:
    raw = "|".join(sorted(listing_ids)) + f"|{notes or ''}"
    digest = hashlib.sha256(raw.encode()).hexdigest()
    return f"itinerary:{digest}"


def build_prompt(listings: list[Listing], notes: str | None) -> str:
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
mentions in their preferences above. If no duration is mentioned, default to one day per stop.

Stops do not need a strict one-to-one mapping to days:
- If there are fewer days than stops, combine multiple stops into the same day where it makes geographic sense.
- If there are more days than stops, let a single stop span multiple consecutive days, varying each
  day's narrative so it doesn't repeat itself.
- Every listing id provided must appear on at least one day somewhere in the itinerary.

Output format is critical: respond with NDJSON (newline-delimited JSON) — one complete, valid JSON
object per line, and NOTHING else. No markdown fences, no commentary, no blank lines.

The FIRST line must be exactly this shape:
{{"trip_title": "string", "intro": "1-2 sentence overview"}}

EVERY SUBSEQUENT line must be exactly this shape, one per day:
{{"day_number": 1, "heading": "short title", "narrative": "2-3 sentences", "listing_ids": ["id1", "id2"]}}

Begin now."""


def _sse(data: dict) -> str:
    return f"data: {json.dumps(data)}\n\n"

def generate_itinerary(db, listing_ids: list[str], notes: str | None):
    from app.schemas.itinerary import ItineraryResponse  # local import avoids a circular import

    cache_key = make_cache_key(listing_ids, notes)
    cached = redis_client.get(cache_key)
    if cached:
        return ItineraryResponse(**json.loads(cached), cached=True)

    listings = db.query(Listing).filter(Listing.id.in_(listing_ids)).all()
    if not listings:
        raise ValueError("No matching listings found for the given ids")

    prompt = build_prompt(listings, notes)
    meta, days = None, []
    for event in stream_itinerary(prompt, cache_key):
        data = json.loads(event.removeprefix("data: ").strip())
        if data["type"] == "meta":
            meta = data
        elif data["type"] == "day":
            days.append({k: v for k, v in data.items() if k != "type"})

    result = {"trip_title": meta.get("trip_title", "Your Nepal Trip"), "intro": meta.get("intro", ""), "days": days}
    return ItineraryResponse(**result, cached=False)


def stream_itinerary(prompt: str, cache_key: str):
    cached = redis_client.get(cache_key)
    if cached:
        payload = json.loads(cached)
        yield _sse({"type": "meta", "trip_title": payload["trip_title"], "intro": payload["intro"]})
        for day in payload["days"]:
            yield _sse({"type": "day", **day})
        yield _sse({"type": "done"})
        return

    buffer = ""
    meta = None
    days: list[dict] = []

    stream = client.chat.completions.create(
        model=settings.groq_model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        stream=True,
    )

    def try_consume_line(line: str):
        nonlocal meta
        line = line.strip().strip("`")
        if not line:
            return
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            return  # skip malformed lines rather than aborting the whole stream

        if meta is None:
            meta = {"trip_title": obj.get("trip_title", "Your Nepal Trip"), "intro": obj.get("intro", "")}
            yield _sse({"type": "meta", **meta})
        else:
            days.append(obj)
            yield _sse({"type": "day", **obj})

    for chunk in stream:
        delta = chunk.choices[0].delta.content or ""
        buffer += delta
        while "\n" in buffer:
            line, buffer = buffer.split("\n", 1)
            yield from try_consume_line(line)

    yield from try_consume_line(buffer)  # flush any trailing content with no final newline

    result = {
        "trip_title": (meta or {}).get("trip_title", "Your Nepal Trip"),
        "intro": (meta or {}).get("intro", ""),
        "days": days,
    }
    redis_client.setex(cache_key, CACHE_TTL_SECONDS, json.dumps(result))
    yield _sse({"type": "done"})