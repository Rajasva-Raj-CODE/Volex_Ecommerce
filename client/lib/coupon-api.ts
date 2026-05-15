"use client";
import { authedApiRequest } from "./auth-api";

export interface CouponValidationResult {
  coupon: { id: string; code: string; discountType: string; discountValue: number };
  discountAmount: number;
}

export async function validateCoupon(code: string, orderAmount: number): Promise<CouponValidationResult> {
  return authedApiRequest<CouponValidationResult>("/coupons/validate", {
    method: "POST",
    json: { code, orderAmount },
  });
}
