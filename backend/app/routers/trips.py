from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.saved_trip import SavedTrip
from app.models.user import User
from app.schemas.trip import TripIn, TripOut

router = APIRouter(prefix="/trips", tags=["trips"])


@router.get("/me", response_model=TripOut | None)
def get_my_trip(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trip = db.query(SavedTrip).filter(SavedTrip.user_id == current_user.id).first()
    if not trip:
        return None
    return TripOut.model_validate(trip)


@router.put("/me", response_model=TripOut)
def save_my_trip(
    payload: TripIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trip = db.query(SavedTrip).filter(SavedTrip.user_id == current_user.id).first()
    if not trip:
        trip = SavedTrip(user_id=current_user.id)

    trip.listing_ids = payload.listing_ids
    trip.notes = payload.notes
    trip.itinerary = payload.itinerary

    db.add(trip)
    db.commit()
    db.refresh(trip)
    return TripOut.model_validate(trip)