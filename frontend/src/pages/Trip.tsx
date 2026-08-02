import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTrip } from "../context/TripContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import type { Listing } from "../types/listing";
import { Badge } from "../components/Badge";
import { Reveal } from "../components/Reveal";

export function Trip() {
    const { user } = useAuth();
    const { selectedIds, toggle, clear, notes, setNotes, itinerary, setItinerary } = useTrip();
    const [listings, setListings] = useState<Listing[]>([]);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (selectedIds.length === 0) { setListings([]); return; }
        api.get<Listing[]>("/listings/by-ids", { params: { ids: selectedIds.join(",") } }).then((res) => setListings(res.data));
    }, [selectedIds]);

    const generate = async () => {
        setGenerating(true);
        setError(null);
        try {
            const res = await api.post("/itinerary/generate", { listing_ids: selectedIds, notes: notes || null });
            setItinerary(res.data);
        } catch {
            setError("Couldn't generate an itinerary right now — your selected stops are still listed below, try again in a moment.");
        } finally {
            setGenerating(false);
        }
    };

    const listingById = (id: string) => listings.find((l) => l.id === id);

    if (selectedIds.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-24 text-center">
                <p className="font-display text-2xl text-[var(--color-ink)] mb-2">Your trip is empty</p>
                <p className="font-sans text-sm text-[var(--color-muted)]">
                    Head to Explore and tap the + on any place that catches your eye.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="font-display text-3xl text-[var(--color-ink)] mb-6">Your trip</h1>

            <div className="flex flex-wrap gap-3 mb-8">
                {listings.map((listing) => (
                    <div key={listing.id} className="flex items-center gap-2 bg-white border border-[var(--color-line)] rounded-full pl-1 pr-3 py-1">
                        <img src={listing.image_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                        <span className="font-sans text-sm">{listing.title}</span>
                        <button onClick={() => toggle(listing.id)} className="text-[var(--color-muted)] hover:text-[var(--color-ink)] text-sm ml-1">×</button>
                    </div>
                ))}
            </div>

            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything the itinerary should know? (e.g. traveling with kids, prefer slow mornings, vegetarian)"
                className="w-full font-sans text-sm bg-white border border-[var(--color-line)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-ink)] transition-colors mb-4 resize-none"
                rows={3}
            />

            {!user && (
                <p className="font-sans text-sm text-[var(--color-muted)] mb-4">
                    <Link to="/login" className="underline text-[var(--color-ink)]">Log in</Link> to generate a personalized itinerary — it's free and takes a few seconds.
                </p>
            )}

            <div className="flex gap-3 mb-10">
                <button
                    onClick={generate}
                    disabled={generating || !user}
                    className="font-sans text-sm font-medium bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                    {generating ? "Writing your itinerary…" : itinerary ? "Regenerate itinerary" : "Generate itinerary"}
                </button>
                <button onClick={clear} className="font-sans text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">Clear trip</button>
            </div>

            {error && <p className="font-sans text-sm text-[var(--color-food)] mb-8">{error}</p>}

            {itinerary && (
                <div>
                    <Reveal>
                        <h2 className="font-display italic text-3xl text-[var(--color-ink)] mb-2">{itinerary.trip_title}</h2>
                        <p className="font-sans text-[var(--color-muted)] mb-10">{itinerary.intro}</p>
                    </Reveal>
                    <div className="space-y-8">
                        {itinerary.days.map((day, i) => {
                            const dayListings = day.listing_ids.map(listingById).filter(Boolean) as Listing[];
                            return (
                                <Reveal key={day.day_number} delayMs={i * 120}>
                                    <div className="flex gap-5 border-t border-[var(--color-line)] pt-6">
                                        <div className="font-mono text-sm text-[var(--color-muted)] pt-1 w-16 shrink-0">Day {day.day_number}</div>
                                        <div className="flex-1">
                                            {dayListings.length > 0 && (
                                                <div className={`grid gap-3 mb-4 ${dayListings.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                                                    {dayListings.map((listing) => (
                                                        <img key={listing.id} src={listing.image_url} alt={listing.title} className="w-full h-48 object-cover rounded-xl" />
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <h3 className="font-display text-xl text-[var(--color-ink)]">{day.heading}</h3>
                                                {dayListings.map((listing) => <Badge key={listing.id} style={listing.trip_style} />)}
                                            </div>
                                            <p className="font-sans text-sm text-[var(--color-ink)]/80 leading-relaxed">{day.narrative}</p>
                                        </div>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}