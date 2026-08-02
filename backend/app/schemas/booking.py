import uuid
from datetime import date, datetime

from pydantic import BaseModel, field_validator

from app.schemas.listing import ListingOut


class BookingCreate(BaseModel):
    listing_id: str
    check_in: date
    check_out: date
    guests: int = 1

    @field_validator("check_out")
    @classmethod
    def check_out_after_check_in(cls, v, info):
        check_in = info.data.get("check_in")
        if check_in and v <= check_in:
            raise ValueError("check_out must be after check_in")
        return v


class BookingOut(BaseModel):
    id: uuid.UUID
    listing: ListingOut
    check_in: date
    check_out: date
    guests: int
    status: str
    created_at: datetime