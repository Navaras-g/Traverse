import type { Listing } from "../types/listing";
import { Badge } from "./Badge";
import { Reveal } from "./Reveal";

export function ListingCard({ listing, delayMs = 0 }: { listing: Listing; delayMs?: number }) {
    return (
        <Reveal delayMs={delayMs}>
            <div className="bg-white rounded-xl overflow-hidden border border-[var(--color-line)] group cursor-pointer">
                <div className="h-44 overflow-hidden">
                    <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
                <div className="p-4">
                    <Badge style={listing.trip_style} />
                    <h3 className="font-display text-lg mt-2 mb-1 text-[var(--color-ink)]">
                        {listing.title}
                    </h3>
                    <p className="font-sans text-sm text-[var(--color-muted)] mb-2">
                        {listing.city}, {listing.region}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-[var(--color-muted)]">
                            ${listing.price_per_night.toFixed(0)}/night
                        </span>
                        <span className="font-sans text-sm text-[var(--color-ink)]">
                            ★ {listing.rating.toFixed(1)}
                        </span>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}