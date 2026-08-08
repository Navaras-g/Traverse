from app.db.session import SessionLocal, engine, Base
from app.db.seed_data import build_listings
from app.models.listing import Listing
from app.services.images import fetch_photo_url
from app.services.embeddings import embed_texts


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    existing = db.query(Listing).count()
    if existing > 0:
        print(f"Listings table already has {existing} rows — skipping seed. Delete rows manually first if you want to reseed.")
        db.close()
        return

    listings_data = build_listings()
    print(f"Seeding {len(listings_data)} listings (fetching images from Pexels)...")

    for item in listings_data:
        item["image_url"] = fetch_photo_url(item.pop("pexels_query"))

    print("Computing embeddings locally (first run downloads the model, ~130MB)...")
    embed_inputs = [
        f"{item['title']}. {item['description']} Located in {item['city']}, {item['region']}. Style: {item['trip_style']}."
        for item in listings_data
    ]
    embeddings = embed_texts(embed_inputs)

    for item, vector in zip(listings_data, embeddings):
        listing = Listing(embedding=vector, **item)
        db.add(listing)
        print(f"  {listing.title} — {listing.city}")

    db.commit()
    db.close()
    print("Done.")


if __name__ == "__main__":
    seed()