import type { Listing } from "../types/listing";
import { Badge } from "./Badge";
import { Reveal } from "./Reveal";
import { useTrip } from "../context/TripContext";

export function ListingCard({ listing, delayMs = 0 }: { listing: Listing; delayMs?: number }) {
    const { selectedIds, toggle } = useTrip();
    const selected = selectedIds.includes(listing.id);

    return (
        <Reveal delayMs={delayMs}>
            <div className="bg-white rounded-xl overflow-hidden border border-[var(--color-line)] group cursor-pointer relative">
                <button
                    onClick={(e) => { e.stopPropagation(); toggle(listing.id); }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                    style={{
                        backgroundColor: selected ? "var(--color-ink)" : "rgba(255,255,255,0.9)",
                        color: selected ? "#fff" : "var(--color-ink)",
                    }}
                    aria-label={selected ? "Remove from trip" : "Add to trip"}
                >
                    {selected ? "✓" : "+"}
                </button>
                <div className="h-44 overflow-hidden">
                    <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
                <div className="p-4">
                    <Badge style={listing.trip_style} />
                    <h3 className="font-display text-lg mt-2 mb-1 text-[var(--color-ink)]">{listing.title}</h3>
                    <p className="font-sans text-sm text-[var(--color-muted)] mb-2">{listing.city}, {listing.region}</p>
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-[var(--color-muted)]">${listing.price_per_night.toFixed(0)}/night</span>
                        <span className="font-sans text-sm text-[var(--color-ink)]">★ {listing.rating.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}