import { z } from "zod";
import { placeOrderSchema } from "../orders/orders.schema";

export const createRazorpayOrderSchema = placeOrderSchema;

export const verifyRazorpayPaymentSchema = placeOrderSchema.extend({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export type CreateRazorpayOrderInput = z.infer<typeof createRazorpayOrderSchema>;
export type VerifyRazorpayPaymentInput = z.infer<typeof verifyRazorpayPaymentSchema>;
