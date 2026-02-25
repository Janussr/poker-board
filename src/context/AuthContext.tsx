"use client";

import { createContext, useContext, useEffect, useState } from "react";

type UserRole = "User" | "Admin" | null;

type AuthContextType = {
    token: string | null;
    role: UserRole;
    isLoggedIn: boolean;
    isAdmin: boolean;
    hydrated: boolean;
    userId: number | null;
    username: string | null;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string): any {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [hydrated, setHydrated] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
const [username, setUsername] = useState<string | null>(null);
    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            setToken(storedToken);
            const payload = parseJwt(storedToken);

            setRole(payload?.role ?? payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null);
            setUserId(payload?.id ?? null);
            setUsername(payload?.unique_name ?? null);
        }
        setHydrated(true);
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);

        const payload = parseJwt(newToken);
        const newRole = payload?.role ?? payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null;
        setRole(newRole);
        setUserId(payload?.id ?? null);
        setUsername(payload?.unique_name ?? null);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setRole(null);
        setUserId(null)
    };

    const isAdmin = role === "Admin";

    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                isLoggedIn: !!token,
                isAdmin,
                login,
                logout,
                hydrated,
                userId,
                username,
                
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return { ...ctx, userId: ctx.userId };
}