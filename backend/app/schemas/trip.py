from pydantic import BaseModel


class TripIn(BaseModel):
    listing_ids: list[str]
    notes: str | None = None
    itinerary: dict | None = None


class TripOut(BaseModel):
    listing_ids: list[str]
    notes: str | None
    itinerary: dict | None

    class Config:
        from_attributes = True