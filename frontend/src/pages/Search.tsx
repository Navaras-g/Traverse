import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Listing } from "../types/listing";
import { ListingCard } from "../components/ListingCard";
import { FilterBar, type Filters } from "../components/FilterBar";
import { MapView } from "../components/MapView";

const EMPTY_FILTERS: Filters = { city: "", region: "", tripStyle: "", budgetMax: "", minRating: "" };

export function Search() {
    const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(true);
            const params: Record<string, string> = {};
            if (filters.city) params.city = filters.city;
            if (filters.region) params.region = filters.region;
            if (filters.tripStyle) params.trip_style = filters.tripStyle;
            if (filters.budgetMax) params.budget_max = filters.budgetMax;
            if (filters.minRating) params.min_rating = filters.minRating;

            api
                .get<Listing[]>("/listings/search", { params })
                .then((res) => setListings(res.data))
                .finally(() => setLoading(false));
        }, 300); // debounce so typing doesn't fire a request per keystroke

        return () => clearTimeout(timeout);
    }, [filters]);

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[280px_1fr_380px] gap-8">
            <aside>
                <h2 className="font-display text-xl mb-6">Refine</h2>
                <FilterBar filters={filters} onChange={setFilters} />
            </aside>

            <main>
                <p className="font-sans text-sm text-[var(--color-muted)] mb-4">
                    {loading ? "Searching…" : `${listings.length} places found`}
                </p>

                {!loading && listings.length === 0 && (
                    <div className="text-center py-20">
                        <p className="font-display text-xl text-[var(--color-ink)] mb-2">Nothing matches yet</p>
                        <p className="font-sans text-sm text-[var(--color-muted)]">
                            Try loosening a filter — Nepal has more to offer than this search caught.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {listings.map((listing, i) => (
                        <ListingCard key={listing.id} listing={listing} delayMs={Math.min(i * 60, 400)} />
                    ))}
                </div>
            </main>

            <div className="hidden lg:block sticky top-24 h-[calc(100vh-140px)]">
                <MapView listings={listings} />
            </div>
        </div>
    );
}