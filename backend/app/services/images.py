import httpx

from app.core.config import settings

PEXELS_API_URL = "https://api.pexels.com/v1/search"


def fetch_photo_url(query: str, size: str = "large") -> str:
    """Returns a landscape photo URL for the query, or a fallback if nothing found.
    size: one of Pexels' src keys — 'large' (~940px, good for cards),
    'large2x' (~1880px, needed for full-bleed hero/background use)."""
    headers = {"Authorization": settings.pexels_api_key}
    params = {"query": query, "per_page": 1, "orientation": "landscape"}

    try:
        resp = httpx.get(PEXELS_API_URL, headers=headers, params=params, timeout=10)
        resp.raise_for_status()
        photos = resp.json().get("photos", [])
        if photos:
            return photos[0]["src"].get(size, photos[0]["src"]["large"])
    except httpx.HTTPError:
        pass

    return "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg"