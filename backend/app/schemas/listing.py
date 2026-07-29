import uuid
from pydantic import BaseModel


class ListingOut(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    city: str
    country: str
    region: str
    trip_style: str
    price_per_night: float
    rating: float
    image_url: str
    latitude: float
    longitude: float
    score: float | None = None

    class Config:
        from_attributes = True