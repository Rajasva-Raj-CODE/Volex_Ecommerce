"use client";

import { apiRequest, ApiError } from "./api";

// ─── Token storage ────────────────────────────────────────────────────────────

const ACCESS_KEY = "voltex_access_token";
const REFRESH_KEY = "voltex_refresh_token";

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

export function getStoredTokens(): StoredTokens | null {
  if (typeof window === "undefined") return null;
  const accessToken = localStorage.getItem(ACCESS_KEY);
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export function setStoredTokens(tokens: StoredTokens): void {
  localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
}

export function clearStoredTokens(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// ─── Authenticated fetch (client-side only) ───────────────────────────────────

export async function authedApiRequest<T>(
  path: string,
  options: Parameters<typeof apiRequest>[1] = {}
): Promise<T> {
  const tokens = getStoredTokens();

  const makeRequest = (accessToken: string | null) => {
    const headers = new Headers(options.headers as HeadersInit | undefined);
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    return apiRequest<T>(path, { ...options, headers });
  };

  try {
    return await makeRequest(tokens?.accessToken ?? null);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401 && tokens?.refreshToken) {
      // Attempt token refresh once
      try {
        const fresh = await apiRequest<StoredTokens>("/auth/refresh", {
          method: "POST",
          json: { refreshToken: tokens.refreshToken },
        });
        setStoredTokens(fresh);
        return await makeRequest(fresh.accessToken);
      } catch {
        clearStoredTokens();
        throw new ApiError("Session expired — please log in again", 401);
      }
    }
    throw err;
  }
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export async function registerCustomer(
  email: string,
  password: string,
  name?: string
): Promise<StoredTokens> {
  return apiRequest<StoredTokens>("/auth/customer/register", {
    method: "POST",
    json: { email, password, name: name?.trim() || undefined },
  });
}

export async function loginCustomer(
  email: string,
  password: string
): Promise<StoredTokens> {
  return apiRequest<StoredTokens>("/auth/customer/login", {
    method: "POST",
    json: { email, password },
  });
}

export async function logoutCustomer(): Promise<void> {
  const tokens = getStoredTokens();
  if (tokens?.refreshToken) {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
        json: { refreshToken: tokens.refreshToken },
      });
    } catch {
      // Best-effort — clear locally regardless
    }
  }
  clearStoredTokens();
}

export interface ApiCustomer {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export async function getCurrentCustomer(): Promise<ApiCustomer> {
  const result = await authedApiRequest<{ user: ApiCustomer }>("/auth/me");
  return result.user;
}
