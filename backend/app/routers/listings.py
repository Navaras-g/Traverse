from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import select, or_
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.listing import Listing
from app.schemas.listing import ListingOut
from app.services.ranking import score_listing
from app.services.embeddings import embed_text

router = APIRouter(prefix="/listings", tags=["listings"])


@router.get("/by-ids", response_model=list[ListingOut])
def get_by_ids(ids: str, db: Session = Depends(get_db)):
    id_list = [i for i in ids.split(",") if i]
    listings = db.query(Listing).filter(Listing.id.in_(id_list)).all()
    return [ListingOut.model_validate(l) for l in listings]

@router.get("/search", response_model=list[ListingOut])
def search_listings(
    q: str | None = None,
    region: str | None = None,
    trip_style: str | None = None,
    budget_max: float | None = Query(None, gt=0),
    min_rating: float | None = Query(None, ge=0, le=5),
    vibe: str | None = None,
    db: Session = Depends(get_db),
):
    query = select(Listing)
    if q:
        like = f"%{q}%"
        query = query.where(or_(Listing.title.ilike(like), Listing.description.ilike(like), Listing.city.ilike(like)))
    if region:
        query = query.where(Listing.region.ilike(f"%{region}%"))
    if trip_style:
        query = query.where(Listing.trip_style == trip_style)
    if min_rating:
        query = query.where(Listing.rating >= min_rating)

    listings = db.execute(query).scalars().all()
    vibe_embedding = embed_text(vibe) if vibe else None

    results = []
    for listing in listings:
        item = ListingOut.model_validate(listing)
        item.score = score_listing(listing, trip_style, budget_max, vibe_embedding)
        results.append(item)

    results.sort(key=lambda x: x.score, reverse=True)
    return results

@router.get("/{listing_id}", response_model=ListingOut)
def get_listing(listing_id: str, db: Session = Depends(get_db)):
    listing = db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return ListingOut.model_validate(listing)