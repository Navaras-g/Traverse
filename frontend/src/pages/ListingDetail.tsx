import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { Listing } from "../types/listing";
import type { Booking } from "../types/booking";
import { Badge } from "../components/Badge";
import { Reveal } from "../components/Reveal";
import { MapView } from "../components/MapView";

type Step = "details" | "review" | "confirmation";

export function ListingDetail() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [listing, setListing] = useState<Listing | null>(null);
    const [step, setStep] = useState<Step>("details");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(2);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

    useEffect(() => {
        if (!id) return;
        api.get<Listing>(`/listings/${id}`).then((res) => setListing(res.data));
    }, [id]);

    const nights =
        checkIn && checkOut
            ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
            : 0;

    const goToReview = () => {
        setError(null);
        if (!checkIn || !checkOut) { setError("Pick both a check-in and check-out date."); return; }
        if (new Date(checkOut) <= new Date(checkIn)) { setError("Check-out must be after check-in."); return; }
        setStep("review");
    };

    const confirmBooking = async () => {
        if (!listing) return;
        setSubmitting(true);
        setError(null);
        try {
            const res = await api.post<Booking>("/bookings", { listing_id: listing.id, check_in: checkIn, check_out: checkOut, guests });
            setConfirmedBooking(res.data);
            setStep("confirmation");
        } catch {
            setError("Couldn't complete the booking — please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!listing) {
        return <div className="max-w-4xl mx-auto px-6 py-20 font-sans text-[var(--color-muted)]">Loading…</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <Reveal>
                <img src={listing.image_url} alt={listing.title} className="w-full h-80 object-cover rounded-2xl mb-6" />
                <div className="flex items-center gap-3 mb-3">
                    <Badge style={listing.trip_style} />
                    <span className="font-sans text-sm text-[var(--color-muted)]">{listing.city}, {listing.region}</span>
                </div>
                <h1 className="font-display text-4xl text-[var(--color-ink)] mb-3">{listing.title}</h1>
                <p className="font-sans text-[var(--color-ink)]/80 leading-relaxed mb-6 max-w-2xl">{listing.description}</p>
                <div className="flex items-center gap-6 mb-10 font-sans text-sm">
                    <span className="font-mono text-[var(--color-ink)]">${listing.price_per_night.toFixed(0)}/night</span>
                    <span>★ {listing.rating.toFixed(1)}</span>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6 items-start">
                <div className="bg-white border border-[var(--color-line)] rounded-2xl p-2 shadow-sm h-72 md:h-[420px]">
                    <MapView listings={[listing]} scrollWheelZoom={true} />
                </div>

                <div className="bg-white border border-[var(--color-line)] rounded-2xl p-6">
                    {step === "details" && (
                        <>
                            <h2 className="font-display text-xl mb-4">Book this stay</h2>
                            {!user && (
                                <p className="font-sans text-sm text-[var(--color-muted)] mb-4">
                                    <Link to="/login" className="underline text-[var(--color-ink)]">Log in</Link> to book — it's free and takes a few seconds.
                                </p>
                            )}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="font-sans text-xs uppercase tracking-wide text-[var(--color-muted)] mb-1.5 block">Check-in</label>
                                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                                        className="w-full font-sans text-sm bg-[var(--color-paper)] border border-[var(--color-line)] rounded-lg px-3 py-2 outline-none focus:border-[var(--color-ink)]" />
                                </div>
                                <div>
                                    <label className="font-sans text-xs uppercase tracking-wide text-[var(--color-muted)] mb-1.5 block">Check-out</label>
                                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                                        className="w-full font-sans text-sm bg-[var(--color-paper)] border border-[var(--color-line)] rounded-lg px-3 py-2 outline-none focus:border-[var(--color-ink)]" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="font-sans text-xs uppercase tracking-wide text-[var(--color-muted)] mb-1.5 block">Guests</label>
                                <input type="number" min={1} max={12} value={guests} onChange={(e) => setGuests(Number(e.target.value))}
                                    className="w-full font-sans text-sm bg-[var(--color-paper)] border border-[var(--color-line)] rounded-lg px-3 py-2 outline-none focus:border-[var(--color-ink)]" />
                            </div>
                            {error && <p className="font-sans text-sm text-[var(--color-food)] mb-3">{error}</p>}
                            <button onClick={goToReview} disabled={!user}
                                className="w-full font-sans text-sm font-medium bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-40">
                                Continue
                            </button>
                        </>
                    )}

                    {step === "review" && (
                        <>
                            <h2 className="font-display text-xl mb-4">Review your booking</h2>
                            <div className="space-y-2 font-sans text-sm mb-5">
                                <div className="flex justify-between"><span className="text-[var(--color-muted)]">Dates</span><span>{checkIn} → {checkOut}</span></div>
                                <div className="flex justify-between"><span className="text-[var(--color-muted)]">Nights</span><span>{nights}</span></div>
                                <div className="flex justify-between"><span className="text-[var(--color-muted)]">Guests</span><span>{guests}</span></div>
                                <div className="flex justify-between font-mono pt-2 border-t border-[var(--color-line)]">
                                    <span className="text-[var(--color-muted)]">Estimated total</span>
                                    <span>${(listing.price_per_night * nights).toFixed(0)}</span>
                                </div>
                            </div>
                            <p className="font-sans text-xs text-[var(--color-muted)] mb-5">
                                This is a simulated booking for demonstration purposes — no payment is processed.
                            </p>
                            {error && <p className="font-sans text-sm text-[var(--color-food)] mb-3">{error}</p>}
                            <div className="flex gap-3">
                                <button onClick={confirmBooking} disabled={submitting}
                                    className="flex-1 font-sans text-sm font-medium bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50">
                                    {submitting ? "Booking…" : "Confirm booking"}
                                </button>
                                <button onClick={() => setStep("details")} className="font-sans text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]">Back</button>
                            </div>
                        </>
                    )}

                    {step === "confirmation" && confirmedBooking && (
                        <Reveal>
                            <div className="text-center py-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--color-adventure)] text-white flex items-center justify-center text-xl mx-auto mb-4">✓</div>
                                <h2 className="font-display text-2xl mb-2">Booking confirmed</h2>
                                <p className="font-sans text-sm text-[var(--color-muted)] mb-6">
                                    {confirmedBooking.listing.title} · {confirmedBooking.check_in} → {confirmedBooking.check_out}
                                </p>
                                <p className="font-mono text-xs text-[var(--color-muted)] mb-6">Confirmation #{confirmedBooking.id.slice(0, 8)}</p>
                                <button onClick={() => navigate("/bookings")}
                                    className="font-sans text-sm font-medium bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
                                    View my bookings
                                </button>
                            </div>
                        </Reveal>
                    )}
                </div>
            </div>
        </div>
    );
}