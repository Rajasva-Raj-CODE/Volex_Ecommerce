import { apiRequest } from "./api";

export interface AdminReview {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
  product: { id: string; name: string; slug: string; images: string[] };
}

export interface ReviewListResponse {
  reviews: AdminReview[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export interface ReviewQuery {
  page?: number;
  limit?: number;
  isApproved?: boolean;
  search?: string;
}

export function listReviews(query: ReviewQuery = {}) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined) params.set(k, String(v));
  }
  const qs = params.toString();
  return apiRequest<ReviewListResponse>(`/reviews${qs ? `?${qs}` : ""}`);
}

export async function updateReviewStatus(id: string, isApproved: boolean) {
  return apiRequest<{ review: AdminReview }>(`/reviews/${id}/status`, {
    method: "PUT",
    json: { isApproved },
  });
}

export async function deleteReview(id: string) {
  return apiRequest<void>(`/reviews/${id}`, { method: "DELETE" });
}
