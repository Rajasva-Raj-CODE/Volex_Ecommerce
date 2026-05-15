"use client";
import { apiRequest } from "./api";
import { authedApiRequest } from "./auth-api";

export interface ProductReview {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: string;
  user: { id: string; name: string | null; avatar: string | null };
}

export interface ProductReviewsResponse {
  reviews: ProductReview[];
  avgRating: number | null;
  totalReviews: number;
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export async function getProductReviews(productId: string, params?: { page?: number; limit?: number }): Promise<ProductReviewsResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return apiRequest<ProductReviewsResponse>(`/reviews/products/${productId}${qs ? `?${qs}` : ""}`);
}

export async function submitReview(productId: string, data: { rating: number; title?: string; comment: string }): Promise<unknown> {
  return authedApiRequest(`/reviews/products/${productId}`, { method: "POST", json: data });
}
