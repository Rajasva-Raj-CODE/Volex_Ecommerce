"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  getCurrentCustomer,
  setStoredTokens,
  clearStoredTokens,
  getStoredTokens,
  type ApiCustomer,
} from "@/lib/auth-api";
import { ApiError } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  isLoggedIn: boolean;
  /** true once the initial session check has completed */
  isReady: boolean;
  user: ApiCustomer | null;
  loginModalOpen: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiCustomer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Bootstrap — restore session from localStorage on mount
  useEffect(() => {
    let cancelled = false;
    const markReady = () => {
      if (!cancelled) setIsReady(true);
    };

    const tokens = getStoredTokens();
    if (!tokens) {
      queueMicrotask(markReady);
      return () => {
        cancelled = true;
      };
    }
    getCurrentCustomer()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => clearStoredTokens())
      .finally(markReady);

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await loginCustomer(email, password);
    setStoredTokens(tokens);
    const currentUser = await getCurrentCustomer();
    setUser(currentUser);
    setLoginModalOpen(false);
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const tokens = await registerCustomer(email, password, name);
    setStoredTokens(tokens);
    const currentUser = await getCurrentCustomer();
    setUser(currentUser);
    setLoginModalOpen(false);
  }, []);

  const continueAsGuest = useCallback(async () => {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const tokens = await registerCustomer(
      `guest-${id}@voltex.guest`,
      `Guest-${id}`.slice(0, 32),
      "Guest"
    );
    setStoredTokens(tokens);
    const currentUser = await getCurrentCustomer();
    setUser(currentUser);
    setLoginModalOpen(false);
  }, []);

  const logout = useCallback(async () => {
    await logoutCustomer();
    setUser(null);
  }, []);

  const openLoginModal = useCallback(() => setLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setLoginModalOpen(false), []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        isReady,
        user,
        loginModalOpen,
        login,
        register,
        continueAsGuest,
        logout,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}

// Re-export ApiError so consumers can check error types without importing from lib
export { ApiError };
