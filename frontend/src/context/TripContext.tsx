import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface TripContextValue {
    selectedIds: string[];
    toggle: (id: string) => void;
    clear: () => void;
}

const TripContext = createContext<TripContextValue | null>(null);
const STORAGE_KEY = "traverse_trip_selection";

export function TripProvider({ children }: { children: ReactNode }) {
    const [selectedIds, setSelectedIds] = useState<string[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    }, [selectedIds]);

    const toggle = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 7 ? prev : [...prev, id]
        );
    };

    return (
        <TripContext.Provider value={{ selectedIds, toggle, clear: () => setSelectedIds([]) }}>
            {children}
        </TripContext.Provider>
    );
}

export function useTrip() {
    const ctx = useContext(TripContext);
    if (!ctx) throw new Error("useTrip must be used within TripProvider");
    return ctx;
}