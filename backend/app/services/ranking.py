import math

from app.models.listing import Listing


def cosine_similarity(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def score_listing(
    listing: Listing,
    trip_style: str | None,
    budget_max: float | None,
    vibe_embedding: list[float] | None = None,
) -> float:
    score = 0.0

    if trip_style and listing.trip_style == trip_style:
        score += 40

    if budget_max and budget_max > 0:
        if listing.price_per_night <= budget_max:
            score += 30 * (1 - listing.price_per_night / budget_max)
        else:
            score -= 20

    score += listing.rating * 6

    if vibe_embedding is not None and listing.embedding is not None:
        similarity = cosine_similarity(list(listing.embedding), vibe_embedding)
        score += similarity * 50  # weighted to matter, but not override exact filters

    return round(score, 2)