/**
 * Mobile API client.
 *
 * Deliberately mirrors client/lib/api.ts — same response envelope, same ApiError
 * shape — so the two packages stay in step with the server. Differences: no
 * Next.js `next` cache options, and the base URL comes from EXPO_PUBLIC_API_URL.
 */

const DEFAULT_API_URL = "http://localhost:8000/api";

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
}

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | null;
  json?: unknown;
  /** Abort the request after this many ms. Phones drop off networks constantly. */
  timeoutMs?: number;
}

export function getApiBaseUrl() {
  return (process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/$/, "");
}

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

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const { json, headers, body, timeoutMs = 15_000, signal, ...init } = options;
  const finalHeaders = new Headers(headers);

  if (!finalHeaders.has("Accept")) finalHeaders.set("Accept", "application/json");
  if (json !== undefined && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  // Combine the caller's signal (screen unmounted) with our own timeout.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const response = await fetch(buildUrl(path), {
      ...init,
      signal: controller.signal,
      headers: finalHeaders,
      body: json !== undefined ? JSON.stringify(json) : body,
    });

    const payload = await parseApiResponse<T>(response);
    return payload.data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
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
