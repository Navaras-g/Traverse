import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await register(email, password, displayName);
            navigate("/");
        } catch (err: any) {
            setError(err?.response?.data?.detail ?? "Could not create account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto px-6 py-20">
            <h1 className="font-display text-3xl mb-8">Create your account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Name"
                    className="w-full font-sans text-sm bg-white border border-[var(--color-line)] rounded-full px-4 py-2.5 outline-none focus:border-[var(--color-ink)]"
                />
                <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full font-sans text-sm bg-white border border-[var(--color-line)] rounded-full px-4 py-2.5 outline-none focus:border-[var(--color-ink)]"
                />
                <input
                    type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min. 8 characters)"
                    className="w-full font-sans text-sm bg-white border border-[var(--color-line)] rounded-full px-4 py-2.5 outline-none focus:border-[var(--color-ink)]"
                />
                {error && <p className="font-sans text-sm text-[var(--color-food)]">{error}</p>}
                <button
                    type="submit" disabled={loading}
                    className="w-full font-sans text-sm font-medium bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading ? "Creating account…" : "Sign up"}
                </button>
            </form>
            <p className="font-sans text-sm text-[var(--color-muted)] mt-6">
                Already have an account? <Link to="/login" className="text-[var(--color-ink)] underline">Log in</Link>
            </p>
        </div>
    );
}