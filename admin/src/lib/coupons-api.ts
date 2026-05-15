import { apiRequest } from "./api";

export interface ApiCoupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: string;
  minOrderAmount: string | null;
  maxDiscountAmount: string | null;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CouponListResponse {
  coupons: ApiCoupon[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateCouponInput {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  expiresAt?: string | null;
  isActive?: boolean;
}

export type UpdateCouponInput = Partial<CreateCouponInput>;

export interface CouponQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export function listCoupons(query: CouponQuery = {}) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined) params.set(k, String(v));
  }
  const qs = params.toString();
  return apiRequest<CouponListResponse>(`/coupons${qs ? `?${qs}` : ""}`);
}

export async function createCoupon(input: CreateCouponInput) {
  const result = await apiRequest<{ coupon: ApiCoupon }>("/coupons", {
    method: "POST",
    json: input,
  });
  return result.coupon;
}

export async function updateCoupon(id: string, input: UpdateCouponInput) {
  const result = await apiRequest<{ coupon: ApiCoupon }>(`/coupons/${id}`, {
    method: "PUT",
    json: input,
  });
  return result.coupon;
}

export function deleteCoupon(id: string) {
  return apiRequest<null>(`/coupons/${id}`, { method: "DELETE" });
}
