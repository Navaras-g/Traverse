from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.booking import Booking
from app.models.interaction import Interaction
from app.models.listing import Listing
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingOut
from app.schemas.listing import ListingOut

router = APIRouter(prefix="/bookings", tags=["bookings"])


def _to_out(booking: Booking, listing: Listing) -> BookingOut:
    return BookingOut(
        id=booking.id,
        listing=ListingOut.model_validate(listing),
        check_in=booking.check_in,
        check_out=booking.check_out,
        guests=booking.guests,
        status=booking.status,
        created_at=booking.created_at,
    )


@router.post("", response_model=BookingOut)
def create_booking(
    payload: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    listing = db.get(Listing, payload.listing_id)
    if not listing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Listing not found")

    booking = Booking(
        user_id=current_user.id,
        listing_id=listing.id,
        check_in=payload.check_in,
        check_out=payload.check_out,
        guests=payload.guests,
        status="confirmed",
    )
    db.add(booking)
    db.add(Interaction(user_id=current_user.id, listing_id=listing.id, type="book"))
    db.commit()
    db.refresh(booking)

    return _to_out(booking, listing)


@router.get("", response_model=list[BookingOut])
def list_bookings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bookings = (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    results = []
    for b in bookings:
        listing = db.get(Listing, b.listing_id)
        if listing:
            results.append(_to_out(b, listing))
    return results