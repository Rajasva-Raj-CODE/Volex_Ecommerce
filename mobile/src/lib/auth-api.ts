import { apiRequest } from "./api";
import type { Tokens } from "./session";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  avatar?: string | null;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
}

/** POST /api/auth/customer/register → tokens (auto-login) */
export function registerCustomer(input: { email: string; password: string; name?: string }) {
  return apiRequest<Tokens>("/auth/customer/register", { method: "POST", json: input });
}

/** POST /api/auth/customer/login → tokens */
export function loginCustomer(input: { email: string; password: string }) {
  return apiRequest<Tokens>("/auth/customer/login", { method: "POST", json: input });
}

/** GET /api/auth/me → the signed-in user */
export async function fetchMe(signal?: AbortSignal) {
  const result = await apiRequest<{ user: AuthUser }>("/auth/me", { auth: true, signal });
  return result.user;
}

/** POST /api/auth/logout — invalidates the refresh token server-side. */
export function logoutRequest(refreshToken: string) {
  return apiRequest<null>("/auth/logout", { method: "POST", json: { refreshToken } });
}

/** POST /api/auth/forgot-password — sends a 6-digit OTP by email. */
export function requestPasswordReset(email: string) {
  return apiRequest<null>("/auth/forgot-password", { method: "POST", json: { email } });
}

/** POST /api/auth/reset-password */
export function resetPassword(input: { email: string; otp: string; newPassword: string }) {
  return apiRequest<null>("/auth/reset-password", { method: "POST", json: input });
}
