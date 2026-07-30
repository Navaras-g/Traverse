import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Listing } from "../types/listing";
import { ListingCard } from "../components/ListingCard";
import { Reveal } from "../components/Reveal";

const TRIP_STYLE_COLORS = ["#A9814A", "#5C7350", "#7C9BA6", "#A85C42", "#7C6485", "#4F7566", "#8B5058"];

export function Home() {
    const [listings, setListings] = useState<Listing[]>([]);

    useEffect(() => {
        api.get<Listing[]>("/listings/search").then((res) => {
            const sorted = [...res.data].sort((a, b) => b.rating - a.rating);
            setListings(sorted.slice(0, 6));
        });
    }, []);

    return (
        <div>
            {/* Hero */}
            <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
                <p
                    className="font-sans text-xs tracking-widest uppercase text-[var(--color-muted)] mb-3"
                    style={{ animation: "fadeUp 0.6s ease-out both" }}
                >
                    Popular destinations · 7 provinces
                </p>
                <h1
                    className="font-display italic text-5xl md:text-7xl leading-tight text-[var(--color-ink)] mb-6 max-w-2xl"
                    style={{ animation: "fadeUp 0.7s ease-out 0.12s both" }}
                >
                    Find your way through Nepal
                </h1>
                <p
                    className="font-sans text-lg text-[var(--color-ink)]/70 mb-8 max-w-md"
                    style={{ animation: "fadeUp 0.7s ease-out 0.24s both" }}
                >
                    Personalized itineraries built from real places — from Thamel's rooftops to Rara's shoreline.
                </p>

                <div
                    className="h-1 rounded-full overflow-hidden mb-8 max-w-md"
                    style={{ animation: "fadeUp 0.6s ease-out 0.36s both" }}
                >
                    <div className="flex h-full" style={{ animation: "drawLine 1.1s ease-out 0.5s both" }}>
                        {TRIP_STYLE_COLORS.map((c) => (
                            <div key={c} className="flex-1" style={{ backgroundColor: c }} />
                        ))}
                    </div>
                </div>

                <Link
                    to="/search"
                    className="inline-block font-sans text-sm font-medium bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                    style={{ animation: "fadeUp 0.6s ease-out 0.5s both" }}
                >
                    Start exploring
                </Link>
            </section>

            {/* Featured listings */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <Reveal>
                    <h2 className="font-display text-2xl text-[var(--color-ink)] mb-6">
                        Highly rated, right now
                    </h2>
                </Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing, i) => (
                        <ListingCard key={listing.id} listing={listing} delayMs={i * 80} />
                    ))}
                </div>
            </section>
        </div>
    );
}