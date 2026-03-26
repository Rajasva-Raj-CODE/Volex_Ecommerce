"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthUser {
    name: string;
    phone: string;
    email: string;
    avatar?: string;
}

interface AuthContextValue {
    isLoggedIn: boolean;
    user: AuthUser | null;
    loginModalOpen: boolean;
    login: (user?: Partial<AuthUser>) => void;
    logout: () => void;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}

// ─── Default mock user ────────────────────────────────────────────────────────

const MOCK_USER: AuthUser = {
    name: "Raj Kumar",
    phone: "+91 98765 43210",
    email: "raj.kumar@email.com",
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Hardcoded demo state — swap isLoggedIn to true to test logged-in view
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    const login = useCallback((partialUser?: Partial<AuthUser>) => {
        setUser({ ...MOCK_USER, ...partialUser });
        setIsLoggedIn(true);
        setLoginModalOpen(false);
    }, []);

    const logout = useCallback(() => {
        setIsLoggedIn(false);
        setUser(null);
    }, []);

    const openLoginModal = useCallback(() => setLoginModalOpen(true), []);
    const closeLoginModal = useCallback(() => setLoginModalOpen(false), []);

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, user, loginModalOpen, login, logout, openLoginModal, closeLoginModal }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
