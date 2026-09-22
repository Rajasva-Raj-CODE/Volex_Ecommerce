import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, loginCustomer, logoutRequest, registerCustomer, type AuthUser } from "../lib/auth-api";
import {
  clearTokens,
  getRefreshToken,
  loadStoredTokens,
  onForcedSignOut,
  saveTokens,
} from "../lib/session";

interface AuthContextValue {
  user: AuthUser | null;
  /** True until the stored session has been restored — gate routing on this. */
  restoring: boolean;
  signedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [restoring, setRestoring] = useState(true);

  // Restore the session before the first route decision, so a signed-in
  // customer never sees the login screen flash on cold start.
  useEffect(() => {
    let active = true;

    (async () => {
      const hasTokens = await loadStoredTokens();
      if (!hasTokens) {
        if (active) setRestoring(false);
        return;
      }

      try {
        const me = await fetchMe();
        if (active) setUser(me);
      } catch {
        // Tokens present but unusable (revoked, or the account is gone).
        // apiRequest already tried a refresh; this is terminal.
        await clearTokens();
      } finally {
        if (active) setRestoring(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // The refresh token was rejected mid-session — drop the user immediately so
  // authed screens stop rendering stale data.
  useEffect(() => onForcedSignOut(() => setUser(null)), []);

  const signIn = useCallback(async (email: string, password: string) => {
    const tokens = await loginCustomer({ email, password });
    await saveTokens(tokens);
    setUser(await fetchMe());
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    const tokens = await registerCustomer({ email, password, name });
    await saveTokens(tokens);
    setUser(await fetchMe());
  }, []);

  const signOut = useCallback(async () => {
    const token = getRefreshToken();

    // Clear locally first: the customer asked to sign out, and a failing
    // network call must not leave them still signed in.
    setUser(null);
    await clearTokens();

    if (token) {
      try {
        await logoutRequest(token);
      } catch {
        // Server-side invalidation failed; the local session is already gone.
      }
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      setUser(await fetchMe());
    } catch {
      // Leave the existing user in place; a transient failure isn't a sign-out.
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, restoring, signedIn: user !== null, signIn, signUp, signOut, refreshUser }),
    [user, restoring, signIn, signUp, signOut, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
