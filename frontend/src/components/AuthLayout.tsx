import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export function AuthLayout({ children }: { children: ReactNode }) {
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        api.get<{ image_url: string }>("/misc/auth-image").then((res) => setImage(res.data.image_url));
    }, []);

    return (
        <div className="min-h-[calc(100vh-73px)] grid grid-cols-1 md:grid-cols-2">
            <div className="relative hidden md:block overflow-hidden">
                {image && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />}
                <div className="absolute inset-0" style={{ background: "linear-gradient(200deg, rgba(20,16,12,0.15) 0%, rgba(20,16,12,0.65) 100%)" }} />
                <div className="absolute inset-6 border border-white/25 rounded-2xl pointer-events-none" />
                <div className="relative h-full flex flex-col justify-end p-12">
                    <Link to="/" className="font-display italic text-3xl text-white mb-4" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>
                        Traverse
                    </Link>
                    <p className="font-display italic text-2xl text-white/95 leading-snug max-w-sm" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>
                        "Explore Nepal. Waiting for you to pick a place to start."
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center px-6 py-16 bg-[var(--color-paper)]">
                <div className="w-full max-w-sm bg-white border border-[var(--color-line)] rounded-2xl shadow-sm p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}