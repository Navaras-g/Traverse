from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import listings, llm_test
from app.routers import listings, llm_test, itinerary, auth, users, trips, bookings

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(listings.router)
app.include_router(llm_test.router)
app.include_router(itinerary.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(trips.router)
app.include_router(bookings.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "environment": settings.environment}