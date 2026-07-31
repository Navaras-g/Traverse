import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface ItineraryDay {
    day_number: number;
    heading: string;
    narrative: string;
    listing_ids: string[];
}

interface ItineraryResult {
    trip_title: string;
    intro: string;
    days: ItineraryDay[];
    cached: boolean;
}

interface TripContextValue {
    selectedIds: string[];
    toggle: (id: string) => void;
    clear: () => void;
    notes: string;
    setNotes: (notes: string) => void;
    itinerary: ItineraryResult | null;
    setItinerary: (itinerary: ItineraryResult | null) => void;
}

const TripContext = createContext<TripContextValue | null>(null);
const SELECTION_KEY = "traverse_trip_selection";
const NOTES_KEY = "traverse_trip_notes";
const ITINERARY_KEY = "traverse_trip_itinerary";

function readJSON<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

export function TripProvider({ children }: { children: ReactNode }) {
    const [selectedIds, setSelectedIds] = useState<string[]>(() => readJSON(SELECTION_KEY, []));
    const [notes, setNotes] = useState<string>(() => readJSON(NOTES_KEY, ""));
    const [itinerary, setItinerary] = useState<ItineraryResult | null>(() => readJSON(ITINERARY_KEY, null));

    useEffect(() => {
        localStorage.setItem(SELECTION_KEY, JSON.stringify(selectedIds));
    }, [selectedIds]);

    useEffect(() => {
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    }, [notes]);

    useEffect(() => {
        localStorage.setItem(ITINERARY_KEY, JSON.stringify(itinerary));
    }, [itinerary]);

    const toggle = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 7 ? prev : [...prev, id]
        );
    };

    const clear = () => {
        setSelectedIds([]);
        setNotes("");
        setItinerary(null);
    };

    return (
        <TripContext.Provider value={{ selectedIds, toggle, clear, notes, setNotes, itinerary, setItinerary }}>
            {children}
        </TripContext.Provider>
    );
}

export function useTrip() {
    const ctx = useContext(TripContext);
    if (!ctx) throw new Error("useTrip must be used within TripProvider");
    return ctx;
}