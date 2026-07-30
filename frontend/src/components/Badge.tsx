import { TRIP_STYLES, type TripStyle } from "../lib/tripStyles";

export function Badge({ style }: { style: TripStyle }) {
    const meta = TRIP_STYLES[style];
    return (
        <span
            className="inline-block text-[11px] font-medium font-sans px-2.5 py-1 rounded-full"
            style={{ backgroundColor: meta.bg, color: meta.text }}
        >
            {meta.label}
        </span>
    );
}