from fastapi import APIRouter

from app.db.redis_client import redis_client
from app.services.images import fetch_photo_url

router = APIRouter(prefix="/misc", tags=["misc"])

HERO_CACHE_KEY = "hero_image_url"
HERO_CACHE_TTL = 60 * 60 * 24 * 30  # 30 days — this is effectively static art direction, not live data

AUTH_CACHE_KEY = "auth_image_url"


@router.get("/hero-image")
def get_hero_image():
    cached = redis_client.get(HERO_CACHE_KEY)
    if cached:
        return {"image_url": cached}

    url = fetch_photo_url("Annapurna Himalaya sunrise panorama mountains", size="large2x")
    redis_client.setex(HERO_CACHE_KEY, HERO_CACHE_TTL, url)
    return {"image_url": url}


@router.get("/auth-image")
def get_auth_image():
    cached = redis_client.get(AUTH_CACHE_KEY)
    if cached:
        return {"image_url": cached}

    url = fetch_photo_url("Kathmandu Nepal temple street evening", size="large2x")
    redis_client.setex(AUTH_CACHE_KEY, HERO_CACHE_TTL, url)
    return {"image_url": url}