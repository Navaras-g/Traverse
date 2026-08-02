import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { Listing } from "../types/listing";
import type { TripStyle } from "../lib/tripStyles";
import { ListingCard } from "../components/ListingCard";
import { Reveal } from "../components/Reveal";

const TRIP_STYLE_COLORS = ["#A9814A", "#5C7350", "#7C9BA6", "#A85C42", "#7C6485", "#4F7566", "#8B5058"];

export function Home() {
    const { user } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [forYou, setForYou] = useState<Listing[]>([]);
    const [heroImage, setHeroImage] = useState<string | null>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        api.get<Listing[]>("/listings/search").then((res) => {
            const sorted = [...res.data].sort((a, b) => b.rating - a.rating);
            setListings(sorted.slice(0, 6));
        });
        api.get<{ image_url: string }>("/misc/hero-image").then((res) => setHeroImage(res.data.image_url));
    }, []);

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const styles: TripStyle[] = (user?.preferences?.trip_styles as TripStyle[]) ?? [];
        const budgetMax = user?.preferences?.budget_max ?? undefined;
        if (styles.length === 0) { setForYou([]); return; }
        Promise.all(
            styles.map((style) =>
                api.get<Listing[]>("/listings/search", { params: { trip_style: style, ...(budgetMax ? { budget_max: budgetMax } : {}) } }).then((res) => res.data)
            )
        ).then((results) => {
            const merged = new Map<string, Listing>();
            results.flat().forEach((l) => merged.set(l.id, l));
            const combined = Array.from(merged.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
            setForYou(combined.slice(0, 6));
        });
    }, [user]);

    return (
        <div>
            {/* Hero */}
            <section ref={heroRef} className="relative h-[92vh] min-h-[560px] overflow-hidden">
                {heroImage && (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${heroImage})`, transform: `translateY(${scrollY * 0.35}px) scale(1.15)` }}
                    />
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(42,36,32,0.35) 0%, rgba(42,36,32,0.15) 40%, var(--color-paper) 96%)" }} />

                {/* postcard-style inset frame */}
                <div className="absolute inset-4 md:inset-8 border border-white/25 rounded-2xl pointer-events-none" />

                <div className="relative h-full max-w-6xl mx-auto px-6 flex flex-col justify-end pb-20">
                    <p className="font-sans text-xs tracking-widest uppercase text-white/80 mb-3" style={{ animation: "fadeUp 0.6s ease-out both" }}>
                        Popular destinations · 7 provinces
                    </p>
                    <h1 className="font-display italic text-5xl md:text-7xl leading-tight text-white mb-6 max-w-2xl drop-shadow-sm" style={{ animation: "fadeUp 0.7s ease-out 0.12s both" }}>
                        Find your way through Nepal
                    </h1>
                    <p className="font-sans text-lg text-white/85 mb-8 max-w-md" style={{ animation: "fadeUp 0.7s ease-out 0.24s both" }}>
                        Personalized itineraries built from real places — from Thamel's rooftops to Rara's shoreline.
                    </p>
                    <div className="h-1 rounded-full overflow-hidden mb-8 max-w-md" style={{ animation: "fadeUp 0.6s ease-out 0.36s both" }}>
                        <div className="flex h-full" style={{ animation: "drawLine 1.1s ease-out 0.5s both" }}>
                            {TRIP_STYLE_COLORS.map((c) => <div key={c} className="flex-1" style={{ backgroundColor: c }} />)}
                        </div>
                    </div>
                    <Link
                        to="/search"
                        className="inline-block w-fit font-sans text-sm font-medium bg-white text-[var(--color-ink)] px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                        style={{ animation: "fadeUp 0.6s ease-out 0.5s both" }}
                    >
                        Start exploring
                    </Link>
                </div>
            </section>

            {forYou.length > 0 && (
                <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
                    <Reveal>
                        <div className="flex items-center gap-2.5 mb-1">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-culture)]" />
                            <h2 className="font-display text-2xl text-[var(--color-ink)]">For you</h2>
                        </div>
                        <p className="font-sans text-sm text-[var(--color-muted)] mb-6">Based on your saved trip styles.</p>
                    </Reveal>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {forYou.map((listing, i) => <ListingCard key={listing.id} listing={listing} delayMs={i * 80} />)}
                    </div>
                </section>
            )}

            {user && forYou.length === 0 && (
                <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
                    <Reveal>
                        <div className="bg-white border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
                            <p className="font-sans text-sm text-[var(--color-ink)]">
                                Set your trip style preferences to see personalized picks here.{" "}
                                <Link to="/preferences" className="underline">Set preferences →</Link>
                            </p>
                        </div>
                    </Reveal>
                </section>
            )}

            <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
                <Reveal>
                    <div className="flex items-center gap-2.5 mb-6">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-adventure)]" />
                        <h2 className="font-display text-2xl text-[var(--color-ink)]">Highly rated, right now</h2>
                    </div>
                </Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing, i) => <ListingCard key={listing.id} listing={listing} delayMs={i * 80} />)}
                </div>
            </section>
        </div>
    );
}