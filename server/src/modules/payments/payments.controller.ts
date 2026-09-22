import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
import { success } from "../../utils/response";
import * as service from "./payments.service";

export async function createRazorpayOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const paymentOrder = await service.createRazorpayOrder(req.user!.userId, req.body);
    success(res, { paymentOrder }, "Payment order created", 201);
  } catch (err) {
    next(err);
  }
}

export async function verifyRazorpayPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await service.verifyRazorpayPayment(req.user!.userId, req.body);
    success(res, { order }, "Payment verified and order placed", 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Razorpay webhook receiver.
 *
 * Signature is checked against the raw bytes; after that every outcome acks with
 * 200 so Razorpay stops redelivering. Only an unverified request or an unset
 * secret produces a non-2xx.
 */
export async function razorpayWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rawBody = req.rawBody ?? Buffer.from(JSON.stringify(req.body ?? {}), "utf8");
    service.verifyWebhookSignature(rawBody, req.header("x-razorpay-signature"));

    const result = await service.handleWebhookEvent(req.body);
    success(res, result, "Webhook processed");
  } catch (err) {
    next(err);
  }
}
