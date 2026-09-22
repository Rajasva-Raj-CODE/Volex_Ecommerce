import { getAccessToken, getApiBaseUrl, refreshSession } from "./session";

/**
 * Mobile API client.
 *
 * Mirrors client/lib/api.ts — same response envelope, same ApiError shape — so
 * the two packages stay in step with the server. Mobile-only additions:
 *   - bearer token attachment + one transparent refresh-and-retry on 401
 *   - a request timeout, because phones drop off networks in a way browsers don't
 */

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

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /** True when the failure is connectivity, not the server rejecting us. */
  get isNetworkError() {
    return this.status === 0;
  }
}

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | null;
  json?: unknown;
  /** Attach the bearer token and retry once after refreshing on 401. */
  auth?: boolean;
  timeoutMs?: number;
}

export { getApiBaseUrl };

function buildUrl(path: string) {
  return `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
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

async function sendRequest(path: string, options: ApiRequestOptions, token: string | null) {
  const { json, headers, body, timeoutMs = 15_000, signal, auth: _auth, ...init } = options;
  const finalHeaders = new Headers(headers);

  if (!finalHeaders.has("Accept")) finalHeaders.set("Accept", "application/json");
  if (json !== undefined && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }
  if (token) finalHeaders.set("Authorization", `Bearer ${token}`);

  // Combine the caller's signal (screen unmounted) with our own timeout.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    return await fetch(buildUrl(path), {
      ...init,
      signal: controller.signal,
      headers: finalHeaders,
      body: json !== undefined ? JSON.stringify(json) : body,
    });
  } catch (err) {
    if (controller.signal.aborted && !signal?.aborted) {
      throw new ApiError("The request timed out. Check your connection.", 0, "TIMEOUT");
    }
    throw new ApiError(
      err instanceof Error ? err.message : "Network request failed",
      0,
      "NETWORK"
    );
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const useAuth = options.auth ?? false;
  let response = await sendRequest(path, options, useAuth ? getAccessToken() : null);

  // Access tokens last 15 minutes, so an expired one is routine, not an error.
  // Refresh once and replay. `refreshSession` is single-flight, so a screen
  // firing three requests at once still rotates the token only once.
  if (useAuth && response.status === 401) {
    const fresh = await refreshSession();
    if (fresh) {
      response = await sendRequest(path, options, fresh);
    }
  }

  const payload = await parseApiResponse<T>(response);
  return payload.data;
}
