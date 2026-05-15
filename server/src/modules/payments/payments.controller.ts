import type { Response, NextFunction } from "express";
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
