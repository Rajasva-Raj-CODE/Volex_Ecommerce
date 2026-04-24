const DEFAULT_API_URL = "http://localhost:8000/api";
const ACCESS_TOKEN_STORAGE_KEY = "voltex_admin_access_token";
const REFRESH_TOKEN_STORAGE_KEY = "voltex_admin_refresh_token";

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  auth?: boolean;
  body?: BodyInit | null;
  json?: unknown;
  retryOnAuthFailure?: boolean;
}

let refreshPromise: Promise<AuthTokens | null> | null = null;

function getApiBaseUrl() {
  return (import.meta.env.VITE_API_URL ?? DEFAULT_API_URL).replace(/\/$/, "");
}

function buildUrl(path: string) {
  return `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getStoredAuthTokens(): AuthTokens | null {
  if (typeof window === "undefined") return null;

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export function setStoredAuthTokens(tokens: AuthTokens) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
}

export function clearStoredAuthTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

async function parseApiResponse<T>(response: Response): Promise<ApiSuccessResponse<T>> {
  let payload: ApiSuccessResponse<T> | ApiErrorResponse | undefined;

  try {
    payload = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;
  } catch {
    payload = undefined;
  }

  if (!response.ok || !payload || payload.success === false) {
    throw new ApiError(
      payload?.message ?? `Request failed with status ${response.status}`,
      response.status,
      payload && "code" in payload ? payload.code : undefined,
      payload
    );
  }

  return payload;
}

async function refreshSession(refreshToken: string): Promise<AuthTokens | null> {
  try {
    const response = await fetch(buildUrl("/auth/refresh"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const payload = await parseApiResponse<AuthTokens>(response);
    setStoredAuthTokens(payload.data);
    return payload.data;
  } catch {
    clearStoredAuthTokens();
    return null;
  }
}

async function requestWithRetry<T>(
  path: string,
  options: ApiRequestOptions,
  allowRetry: boolean
): Promise<T> {
  const {
    auth = true,
    retryOnAuthFailure = auth,
    json,
    headers,
    body,
    ...init
  } = options;

  const finalHeaders = new Headers(headers);

  if (!finalHeaders.has("Accept")) {
    finalHeaders.set("Accept", "application/json");
  }

  if (json !== undefined && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  const storedTokens = auth ? getStoredAuthTokens() : null;
  if (storedTokens?.accessToken) {
    finalHeaders.set("Authorization", `Bearer ${storedTokens.accessToken}`);
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers: finalHeaders,
    body: json !== undefined ? JSON.stringify(json) : body,
  });

  if (response.status === 401 && auth && retryOnAuthFailure && allowRetry) {
    const refreshToken = storedTokens?.refreshToken;
    if (!refreshToken) {
      clearStoredAuthTokens();
    } else {
      refreshPromise ??= refreshSession(refreshToken).finally(() => {
        refreshPromise = null;
      });

      const refreshedTokens = await refreshPromise;
      if (refreshedTokens) {
        return requestWithRetry<T>(path, options, false);
      }
    }
  }

  const payload = await parseApiResponse<T>(response);
  return payload.data;
}

export function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  return requestWithRetry<T>(path, options, true);
}
