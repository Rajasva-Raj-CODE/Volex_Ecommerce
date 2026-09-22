import * as SecureStore from "expo-secure-store";

/**
 * Owns the access/refresh token pair and the refresh handshake.
 *
 * Deliberately does NOT use `apiRequest` — that module calls back into this one
 * to attach headers and retry 401s, and routing the refresh through it would
 * make the cycle infinite as well as circular. The refresh is a raw fetch.
 *
 * Tokens live in the OS keystore (Keychain / EncryptedSharedPreferences), not
 * AsyncStorage, because a refresh token is a 7-day credential.
 */

const ACCESS_KEY = "voltex_access_token";
const REFRESH_KEY = "voltex_refresh_token";
const DEFAULT_API_URL = "http://localhost:8000/api";

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

let accessToken: string | null = null;
let refreshToken: string | null = null;

/** In-flight refresh, so N concurrent 401s trigger one rotation, not N. */
let refreshInFlight: Promise<string | null> | null = null;

type SignOutListener = () => void;
const signOutListeners = new Set<SignOutListener>();

/** Notified when the refresh token is rejected and the session is gone. */
export function onForcedSignOut(listener: SignOutListener) {
  signOutListeners.add(listener);
  return () => {
    signOutListeners.delete(listener);
  };
}

export function getApiBaseUrl() {
  return (process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/$/, "");
}

export function getAccessToken() {
  return accessToken;
}

export function hasSession() {
  return refreshToken !== null;
}

/**
 * The raw refresh token, needed only to invalidate it server-side on sign-out.
 * Nothing else should read it — use `apiRequest({ auth: true })` instead.
 */
export function getRefreshToken() {
  return refreshToken;
}

/**
 * Reads the stored pair at boot. SecureStore can throw (locked keychain, wiped
 * credentials), and a failure there must read as "signed out" rather than
 * crashing the app before it renders.
 */
export async function loadStoredTokens(): Promise<boolean> {
  try {
    const [storedAccess, storedRefresh] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_KEY),
      SecureStore.getItemAsync(REFRESH_KEY),
    ]);
    accessToken = storedAccess;
    refreshToken = storedRefresh;
    return refreshToken !== null;
  } catch {
    accessToken = null;
    refreshToken = null;
    return false;
  }
}

export async function saveTokens(tokens: Tokens) {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
  try {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken),
      SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken),
    ]);
  } catch {
    // Writing failed — the session still works for this launch, it just won't
    // survive a restart. Better than blocking a successful login.
  }
}

export async function clearTokens() {
  accessToken = null;
  refreshToken = null;
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_KEY),
      SecureStore.deleteItemAsync(REFRESH_KEY),
    ]);
  } catch {
    // Nothing useful to do; in-memory tokens are already gone.
  }
}

/**
 * Rotates the token pair. Returns the new access token, or null if the refresh
 * token was rejected — in which case the session is cleared and listeners fire.
 *
 * The server invalidates the old refresh token on use, so this MUST be
 * single-flight: two parallel calls would race, and the loser's token would
 * already be dead.
 */
export function refreshSession(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  const token = refreshToken;
  if (!token) return Promise.resolve(null);

  refreshInFlight = (async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ refreshToken: token }),
      });

      if (!response.ok) {
        await clearTokens();
        signOutListeners.forEach((fn) => fn());
        return null;
      }

      const payload = (await response.json()) as { data?: Tokens };
      if (!payload.data?.accessToken || !payload.data.refreshToken) {
        await clearTokens();
        signOutListeners.forEach((fn) => fn());
        return null;
      }

      await saveTokens(payload.data);
      return payload.data.accessToken;
    } catch {
      // Network failure, not a rejected token — keep the session so the next
      // request can try again rather than signing the customer out on a blip.
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}
