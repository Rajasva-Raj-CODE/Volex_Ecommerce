"use client";

import { authedApiRequest } from "./auth-api";
import type { CreateOrderInput, CustomerOrder } from "./orders-api";

export interface RazorpayPaymentOrder {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface RazorpayVerificationInput extends CreateOrderInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export async function createRazorpayOrder(input: CreateOrderInput): Promise<RazorpayPaymentOrder> {
  const result = await authedApiRequest<{ paymentOrder: RazorpayPaymentOrder }>("/payments/razorpay/order", {
    method: "POST",
    json: input,
  });
  return result.paymentOrder;
}

export async function verifyRazorpayPayment(input: RazorpayVerificationInput): Promise<CustomerOrder> {
  const result = await authedApiRequest<{ order: CustomerOrder }>("/payments/razorpay/verify", {
    method: "POST",
    json: input,
  });
  return result.order;
}
