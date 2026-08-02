import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "../components/AuthLayout";

export function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
            navigate("/");
        } catch {
            setError("Incorrect email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="flex items-center gap-2.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-[var(--color-relaxation)]" />
                <p className="font-sans text-xs uppercase tracking-widest text-[var(--color-muted)]">Welcome back</p>
            </div>
            <h1 className="font-display text-3xl mb-6">Log in</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="font-sans text-xs uppercase tracking-wide text-[var(--color-muted)] mb-1.5 block">Email</label>
                    <input
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full font-sans text-sm bg-[var(--color-paper)] border border-[var(--color-line)] rounded-full px-4 py-2.5 outline-none focus:border-[var(--color-ink)] transition-colors"
                    />
                </div>
                <div>
                    <label className="font-sans text-xs uppercase tracking-wide text-[var(--color-muted)] mb-1.5 block">Password</label>
                    <input
                        type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full font-sans text-sm bg-[var(--color-paper)] border border-[var(--color-line)] rounded-full px-4 py-2.5 outline-none focus:border-[var(--color-ink)] transition-colors"
                    />
                </div>
                {error && <p className="font-sans text-sm text-[var(--color-food)]">{error}</p>}
                <button
                    type="submit" disabled={loading}
                    className="w-full font-sans text-sm font-medium bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading ? "Logging in…" : "Log in"}
                </button>
            </form>
            <p className="font-sans text-sm text-[var(--color-muted)] mt-6">
                No account yet? <Link to="/register" className="text-[var(--color-ink)] underline">Sign up</Link>
            </p>
        </AuthLayout>
    );
}