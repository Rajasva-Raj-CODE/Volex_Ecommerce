import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
import * as service from "./orders.service";
import { orderQuerySchema } from "./orders.schema";
import { success } from "../../utils/response";

export async function placeOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await service.placeOrder(req.user!.userId, req.body);
    success(res, { order }, "Order placed", 201);
  } catch (err) { next(err); }
}

export async function getUserOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = orderQuerySchema.parse(req.query);
    const result = await service.getUserOrders(req.user!.userId, query);
    success(res, result);
  } catch (err) { next(err); }
}

export async function getOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    // customers see only their own; admin/staff see any
    const userId = req.user!.role === "ADMIN" || req.user!.role === "STAFF"
      ? undefined
      : req.user!.userId;
    const order = await service.getOrder(id, userId);
    success(res, { order });
  } catch (err) { next(err); }
}

export async function listAllOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = orderQuerySchema.parse(req.query);
    const result = await service.listAllOrders(query);
    success(res, result);
  } catch (err) { next(err); }
}

export async function updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const order = await service.updateOrderStatus(id, req.body);
    success(res, { order }, "Order status updated");
  } catch (err) { next(err); }
}
