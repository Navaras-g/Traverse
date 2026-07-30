import { Link } from "react-router-dom";

export function Navbar() {
    return (
        <header className="sticky top-0 z-10 bg-[var(--color-paper)]/90 backdrop-blur-sm border-b border-[var(--color-line)]">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="font-display italic text-2xl text-[var(--color-ink)]">
                    Traverse
                </Link>
                <nav className="flex gap-6 font-sans text-sm text-[var(--color-ink)]">
                    <Link to="/search">Explore</Link>
                </nav>
            </div>
        </header>
    );
}