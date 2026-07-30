from pydantic import BaseModel


class ItineraryRequest(BaseModel):
    listing_ids: list[str]
    notes: str | None = None


class ItineraryDay(BaseModel):
    day_number: int
    heading: str
    narrative: str
    listing_id: str


class ItineraryResponse(BaseModel):
    trip_title: str
    intro: str
    days: list[ItineraryDay]
    cached: bool = False