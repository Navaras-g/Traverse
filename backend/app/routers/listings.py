from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, or_
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.listing import Listing
from app.schemas.listing import ListingOut
from app.services.ranking import score_listing

router = APIRouter(prefix="/listings", tags=["listings"])


@router.get("/search", response_model=list[ListingOut])
def search_listings(
    q: str | None = None,
    region: str | None = None,
    trip_style: str | None = None,
    budget_max: float | None = Query(None, gt=0),
    min_rating: float | None = Query(None, ge=0, le=5),
    db: Session = Depends(get_db),
):
    query = select(Listing)
    if q:
        like = f"%{q}%"
        query = query.where(
            or_(Listing.title.ilike(like), Listing.description.ilike(like), Listing.city.ilike(like))
        )
    if region:
        query = query.where(Listing.region.ilike(f"%{region}%"))
    if trip_style:
        query = query.where(Listing.trip_style == trip_style)
    if min_rating:
        query = query.where(Listing.rating >= min_rating)

    listings = db.execute(query).scalars().all()

    results = []
    for listing in listings:
        item = ListingOut.model_validate(listing)
        item.score = score_listing(listing, trip_style, budget_max)
        results.append(item)

    results.sort(key=lambda x: x.score, reverse=True)
    return results