import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { Booking } from "../types/booking";
import { Badge } from "../components/Badge";
import { Reveal } from "../components/Reveal";

export function Bookings() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => { if (!loading && !user) navigate("/login"); }, [loading, user, navigate]);

    useEffect(() => {
        if (!user) return;
        api.get<Booking[]>("/bookings").then((res) => { setBookings(res.data); setFetching(false); });
    }, [user]);

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="font-display text-3xl mb-8">My bookings</h1>
            {!fetching && bookings.length === 0 && (
                <p className="font-sans text-sm text-[var(--color-muted)]">
                    No bookings yet — <Link to="/search" className="underline text-[var(--color-ink)]">start exploring</Link>.
                </p>
            )}
            <div className="space-y-4">
                {bookings.map((b, i) => (
                    <Reveal key={b.id} delayMs={i * 60}>
                        <div className="flex gap-4 bg-white border border-[var(--color-line)] rounded-xl p-4">
                            <img src={b.listing.image_url} alt={b.listing.title} className="w-24 h-24 object-cover rounded-lg" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-display text-lg">{b.listing.title}</h3>
                                    <Badge style={b.listing.trip_style} />
                                </div>
                                <p className="font-sans text-sm text-[var(--color-muted)] mb-1">{b.listing.city}, {b.listing.region}</p>
                                <p className="font-mono text-xs text-[var(--color-muted)]">{b.check_in} → {b.check_out} · {b.guests} guest{b.guests > 1 ? "s" : ""}</p>
                            </div>
                            <span className="font-sans text-xs self-start bg-[var(--color-adventure)]/10 text-[var(--color-adventure)] px-2.5 py-1 rounded-full h-fit">{b.status}</span>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}