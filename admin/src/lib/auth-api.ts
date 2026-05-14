import { apiRequest, clearStoredAuthTokens, getStoredAuthTokens, type AuthTokens } from "./api";
import type { User } from "./types";

interface CurrentUserResponse {
  user: User;
}

interface AdminLoginInput {
  email: string;
  password: string;
}

export async function loginAdmin(input: AdminLoginInput) {
  return apiRequest<AuthTokens>("/auth/login", {
    method: "POST",
    auth: false,
    retryOnAuthFailure: false,
    json: input,
  });
}

export async function getCurrentUser() {
  const data = await apiRequest<CurrentUserResponse>("/auth/me");
  return data.user;
}

export async function logoutAdmin() {
  const storedTokens = getStoredAuthTokens();

  try {
    if (storedTokens?.refreshToken) {
      await apiRequest<null>("/auth/logout", {
        method: "POST",
        auth: false,
        retryOnAuthFailure: false,
        json: { refreshToken: storedTokens.refreshToken },
      });
    }
  } finally {
    clearStoredAuthTokens();
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  await apiRequest("/users/change-password", {
    method: "PUT",
    json: { currentPassword, newPassword },
  });
}

export async function forgotPassword(email: string) {
  await apiRequest("/auth/forgot-password", {
    method: "POST",
    auth: false,
    retryOnAuthFailure: false,
    json: { email },
  });
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
  await apiRequest("/auth/reset-password", {
    method: "POST",
    auth: false,
    retryOnAuthFailure: false,
    json: { email, otp, newPassword },
  });
}
