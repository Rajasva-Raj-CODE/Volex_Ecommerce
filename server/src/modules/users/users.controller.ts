import type { Request, Response, NextFunction } from "express";
import { success } from "../../utils/response";
import { usersQuerySchema } from "./users.schema";
import * as service from "./users.service";
import type { AuthRequest } from "../../middleware/auth.middleware";

export async function listCustomers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = usersQuerySchema.parse(req.query);
    const result = await service.listCustomers(query);
    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await service.updateProfile(req.user!.userId, req.body);
    success(res, { user }, "Profile updated successfully");
  } catch (err) {
    next(err);
  }
}

export async function changePassword(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await service.changePassword(req.user!.userId, req.body);
    success(res, null, "Password changed successfully");
  } catch (err) {
    next(err);
  }
}
