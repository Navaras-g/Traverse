import { Link } from "react-router-dom";
import { useTrip } from "../context/TripContext";

export function Navbar() {
    const { selectedIds } = useTrip();
    return (
        <header className="sticky top-0 z-10 bg-[var(--color-paper)]/90 backdrop-blur-sm border-b border-[var(--color-line)]">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="font-display italic text-2xl text-[var(--color-ink)]">Traverse</Link>
                <nav className="flex items-center gap-6 font-sans text-sm text-[var(--color-ink)]">
                    <Link to="/search">Explore</Link>
                    <Link to="/trip" className="flex items-center gap-1.5">
                        My Trip
                        {selectedIds.length > 0 && (
                            <span className="bg-[var(--color-ink)] text-[var(--color-paper)] text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                                {selectedIds.length}
                            </span>
                        )}
                    </Link>
                </nav>
            </div>
        </header>
    );
}