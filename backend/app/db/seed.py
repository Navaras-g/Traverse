from app.db.session import SessionLocal, engine, Base
from app.db.seed_data import build_listings
from app.models.listing import Listing
from app.services.images import fetch_photo_url


def seed():
    Base.metadata.create_all(bind=engine)  # safety net; Alembic already created these
    db = SessionLocal()

    existing = db.query(Listing).count()
    if existing > 0:
        print(f"Listings table already has {existing} rows — skipping seed. "
              f"Delete rows manually first if you want to reseed.")
        db.close()
        return

    listings_data = build_listings()
    print(f"Seeding {len(listings_data)} listings (fetching images from Pexels)...")

    for i, item in enumerate(listings_data, start=1):
        image_url = fetch_photo_url(item.pop("pexels_query"))
        listing = Listing(image_url=image_url, **item)
        db.add(listing)
        print(f"  [{i}/{len(listings_data)}] {listing.title} — {listing.city}")

    db.commit()
    db.close()
    print("Done.")


if __name__ == "__main__":
    seed()