from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.listing import Listing
from app.models.user import User
from app.schemas.itinerary import ItineraryRequest, ItineraryResponse
from app.services.itinerary import build_prompt, generate_itinerary, make_cache_key, stream_itinerary

router = APIRouter(prefix="/itinerary", tags=["itinerary"])


@router.post("/generate", response_model=ItineraryResponse)
def generate(payload: ItineraryRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not payload.listing_ids:
        raise HTTPException(status_code=400, detail="Select at least one listing")
    if len(payload.listing_ids) > 7:
        raise HTTPException(status_code=400, detail="Limit itineraries to 7 stops")
    try:
        return generate_itinerary(db, payload.listing_ids, payload.notes)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=f"Could not generate itinerary: {e}")


@router.post("/generate/stream")
def generate_stream(payload: ItineraryRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not payload.listing_ids:
        raise HTTPException(status_code=400, detail="Select at least one listing")
    if len(payload.listing_ids) > 7:
        raise HTTPException(status_code=400, detail="Limit itineraries to 7 stops")

    # Resolve everything DB-related BEFORE returning the StreamingResponse — the
    # get_db() dependency closes its session as soon as this function returns,
    # which happens immediately once we hand back the response, before the
    # generator below actually starts running.
    listings = db.query(Listing).filter(Listing.id.in_(payload.listing_ids)).all()
    if not listings:
        raise HTTPException(status_code=404, detail="No matching listings found")

    prompt = build_prompt(listings, payload.notes)
    cache_key = make_cache_key(payload.listing_ids, payload.notes)

    return StreamingResponse(stream_itinerary(prompt, cache_key), media_type="text/event-stream")