import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        <div className="max-w-sm mx-auto px-6 py-20">
            <h1 className="font-display text-3xl mb-8">Welcome back</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full font-sans text-sm bg-white border border-[var(--color-line)] rounded-full px-4 py-2.5 outline-none focus:border-[var(--color-ink)]"
                />
                <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full font-sans text-sm bg-white border border-[var(--color-line)] rounded-full px-4 py-2.5 outline-none focus:border-[var(--color-ink)]"
                />
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
        </div>
    );
}