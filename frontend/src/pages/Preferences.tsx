import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { TRIP_STYLES, type TripStyle } from "../lib/tripStyles";

export function Preferences() {
    const { user, loading, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [selected, setSelected] = useState<TripStyle[]>([]);
    const [budgetMax, setBudgetMax] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!loading && !user) navigate("/login");
    }, [loading, user, navigate]);

    useEffect(() => {
        if (user?.preferences) {
            setSelected((user.preferences.trip_styles as TripStyle[]) ?? []);
            setBudgetMax(user.preferences.budget_max ? String(user.preferences.budget_max) : "");
        }
    }, [user]);

    const toggleStyle = (style: TripStyle) => {
        setSelected((prev) => (prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]));
    };

    const save = async () => {
        setSaving(true);
        setSaved(false);
        await api.patch("/users/me/preferences", {
            trip_styles: selected,
            budget_max: budgetMax ? Number(budgetMax) : null,
        });
        await refreshUser();
        setSaving(false);
        setSaved(true);
    };

    if (!user) return null;

    return (
        <div className="max-w-xl mx-auto px-6 py-16">
            <h1 className="font-display text-3xl mb-2">Your preferences</h1>
            <p className="font-sans text-sm text-[var(--color-muted)] mb-8">
                This shapes what shows up in "For You" on the homepage.
            </p>

            <label className="font-sans text-xs uppercase tracking-wide text-[var(--color-muted)] mb-2 block">
                Trip styles you enjoy
            </label>
            <div className="flex flex-wrap gap-2 mb-8">
                {(Object.keys(TRIP_STYLES) as TripStyle[]).map((style) => {
                    const meta = TRIP_STYLES[style];
                    const active = selected.includes(style);
                    return (
                        <button
                            key={style}
                            onClick={() => toggleStyle(style)}
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

            <label className="font-sans text-xs uppercase tracking-wide text-[var(--color-muted)] mb-2 block">
                Typical budget per night ($)
            </label>
            <input
                type="number" min={0} value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)}
                placeholder="e.g. 40"
                className="w-full font-mono text-sm bg-white border border-[var(--color-line)] rounded-full px-4 py-2.5 outline-none focus:border-[var(--color-ink)] mb-8"
            />

            <button
                onClick={save} disabled={saving}
                className="font-sans text-sm font-medium bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
            >
                {saving ? "Saving…" : "Save preferences"}
            </button>
            {saved && <p className="font-sans text-sm text-[var(--color-adventure)] mt-3">Saved.</p>}
        </div>
    );
}