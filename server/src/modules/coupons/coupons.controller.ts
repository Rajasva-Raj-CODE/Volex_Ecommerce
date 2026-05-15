import type { Request, Response, NextFunction } from "express";
import { success } from "../../utils/response";
import { couponQuerySchema } from "./coupons.schema";
import * as service from "./coupons.service";

export async function validateCoupon(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await service.validateCoupon(req.body.code, req.body.orderAmount);
    success(res, result, "Coupon is valid");
  } catch (err) {
    next(err);
  }
}

export async function listCoupons(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = couponQuerySchema.parse(req.query);
    const result = await service.listCoupons(query);
    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function createCoupon(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const coupon = await service.createCoupon(req.body);
    success(res, { coupon }, "Coupon created successfully", 201);
  } catch (err) {
    next(err);
  }
}

export async function updateCoupon(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const coupon = await service.updateCoupon(id, req.body);
    success(res, { coupon }, "Coupon updated successfully");
  } catch (err) {
    next(err);
  }
}

export async function deleteCoupon(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await service.deleteCoupon(id);
    success(res, null, "Coupon deleted successfully");
  } catch (err) {
    next(err);
  }
}
