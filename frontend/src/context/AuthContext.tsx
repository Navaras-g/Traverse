import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";

interface UserPreferences {
    trip_styles?: string[];
    budget_max?: number | null;
}

interface User {
    id: string;
    email: string;
    display_name: string;
    preferences: UserPreferences;
}

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = "traverse_token";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        api
            .get<User>("/auth/me")
            .then((res) => setUser(res.data))
            .catch(() => {
                setToken(null);
                localStorage.removeItem(TOKEN_KEY);
            })
            .finally(() => setLoading(false));
    }, [token]);

    const login = async (email: string, password: string) => {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem(TOKEN_KEY, res.data.access_token);
        setToken(res.data.access_token);
        setUser(res.data.user);
    };

    const register = async (email: string, password: string, displayName: string) => {
        const res = await api.post("/auth/register", { email, password, display_name: displayName });
        localStorage.setItem(TOKEN_KEY, res.data.access_token);
        setToken(res.data.access_token);
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        const res = await api.get<User>("/auth/me");
        setUser(res.data);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}