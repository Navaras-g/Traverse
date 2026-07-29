from app.models.listing import Listing


def score_listing(listing: Listing, trip_style: str | None, budget_max: float | None) -> float:
    score = 0.0

    if trip_style and listing.trip_style == trip_style:
        score += 40

    if budget_max and budget_max > 0:
        if listing.price_per_night <= budget_max:
            score += 30 * (1 - listing.price_per_night / budget_max)
        else:
            score -= 20  # over budget — penalize but don't hide

    score += listing.rating * 6  # ratings range 0-5, so up to 30 points

    return round(score, 2)