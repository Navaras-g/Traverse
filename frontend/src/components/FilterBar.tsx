import { TRIP_STYLES, type TripStyle } from "../lib/tripStyles";

const REGIONS = ["Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim", "Koshi", "Madhesh"];

export interface Filters {
    city: string;
    region: string;
    tripStyle: TripStyle | "";
    budgetMax: string;
    minRating: string;
}

interface FilterBarProps {
    filters: Filters;
    onChange: (filters: Filters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
    const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

    return (
        <div className="space-y-5">
            <div>
                <label className="font-sans text-xs uppercase tracking-wide text-[var(--color-muted)] mb-2 block">
                    Search a city
                </label>
                <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => update({ city: e.target.value })}
                    placeholder="e.g. Pokhara"
                    className="w-full font-sans text-sm bg-white border border-[var(--color-line)] rounded-full px-4 py-2.5 outline-none focus:border-[var(--color-ink)] transition-colors"
                />
            </div>

            <div>
                <label className="font-sans text-xs uppercase tracking-wide text-[var(--color-muted)] mb-2 block">
                    Trip style
                </label>
                <div className="flex flex-wrap gap-2">
                    {(Object.keys(TRIP_STYLES) as TripStyle[]).map((style) => {
                        const meta = TRIP_STYLES[style];
                        const active = filters.tripStyle === style;
                        return (
                            <button
                                key={style}
                                onClick={() => update({ tripStyle: active ? "" : style })}
                                className="text-xs font-sans font-medium px-3 py-1.5 rounded-full border transition-all"
                                style={{
                                    backgroundColor: active ? meta.color : meta.bg,
                                    color: active ? "#fff" : meta.text,
                                    borderColor: active ? meta.color : "transparent",
                                }}
                            >
                                {meta.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className="font-sans text-xs uppercase tracking-wide text-[var(--color-muted)] mb-2 block">
                    Province
                </label>
                <select
                    value={filters.region}
                    onChange={(e) => update({ region: e.target.value })}
                    className="w-full font-sans text-sm bg-white border border-[var(--color-line)] rounded-full px-4 py-2.5 outline-none focus:border-[var(--color-ink)] transition-colors"
                >
                    <option value="">All provinces</option>
                    {REGIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="font-sans text-xs uppercase tracking-wide text-[var(--color-muted)] mb-2 block">
                        Max $/night
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={filters.budgetMax}
                        onChange={(e) => update({ budgetMax: e.target.value })}
                        placeholder="Any"
                        className="w-full font-mono text-sm bg-white border border-[var(--color-line)] rounded-full px-4 py-2.5 outline-none focus:border-[var(--color-ink)] transition-colors"
                    />
                </div>
                <div>
                    <label className="font-sans text-xs uppercase tracking-wide text-[var(--color-muted)] mb-2 block">
                        Min rating
                    </label>
                    <select
                        value={filters.minRating}
                        onChange={(e) => update({ minRating: e.target.value })}
                        className="w-full font-sans text-sm bg-white border border-[var(--color-line)] rounded-full px-4 py-2.5 outline-none focus:border-[var(--color-ink)] transition-colors"
                    >
                        <option value="">Any</option>
                        <option value="4">4.0+</option>
                        <option value="4.5">4.5+</option>
                    </select>
                </div>
            </div>
        </div>
    );
}