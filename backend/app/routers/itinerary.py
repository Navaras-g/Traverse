import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.itinerary import ItineraryRequest, ItineraryResponse
from app.services.itinerary import generate_itinerary

router = APIRouter(prefix="/itinerary", tags=["itinerary"])


@router.post("/generate", response_model=ItineraryResponse)
def generate(payload: ItineraryRequest, db: Session = Depends(get_db)):
    if not payload.listing_ids:
        raise HTTPException(status_code=400, detail="Select at least one listing")
    if len(payload.listing_ids) > 7:
        raise HTTPException(status_code=400, detail="Limit itineraries to 7 stops")

    try:
        return generate_itinerary(db, payload.listing_ids, payload.notes)
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(status_code=502, detail=f"Could not generate itinerary: {e}")