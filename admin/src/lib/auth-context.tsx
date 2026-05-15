import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { User, Role } from "./types";
import {
  ApiError,
  clearStoredAuthTokens,
  getStoredAuthTokens,
  setStoredAuthTokens,
} from "./api";
import { getCurrentUser, loginAdmin, logoutAdmin } from "./auth-api";

interface AuthContextType {
  user: User | null;
  isReady: boolean;
  isLoggingIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (allowed: Role[]) => boolean;
  /** Call after manually storing tokens (e.g. OTP login) to hydrate the user state. */
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const bootstrapSession = useCallback(async () => {
    const storedTokens = getStoredAuthTokens();
    if (!storedTokens) {
      setIsReady(true);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      clearStoredAuthTokens();
      setUser(null);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    void bootstrapSession();
  }, [bootstrapSession]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoggingIn(true);

    try {
      const tokens = await loginAdmin({ email, password });
      setStoredAuthTokens(tokens);

      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsReady(true);
    } catch (error) {
      clearStoredAuthTokens();
      setUser(null);
      setIsReady(true);

      if (error instanceof ApiError) {
        throw error;
      }

      throw new Error("Unable to sign in");
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutAdmin();
    setUser(null);
    setIsReady(true);
  }, []);

  const hasRole = useCallback(
    (allowed: Role[]): boolean => {
      if (!user) return false;
      return allowed.includes(user.role);
    },
    [user]
  );

  const refreshSession = useCallback(async () => {
    await bootstrapSession();
  }, [bootstrapSession]);

  return (
    <AuthContext.Provider
      value={{ user, isReady, isLoggingIn, login, logout, hasRole, refreshSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
