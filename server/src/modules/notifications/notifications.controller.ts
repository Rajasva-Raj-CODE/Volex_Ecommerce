import type { Response, NextFunction } from "express";
import { z } from "zod";
import type { AuthRequest } from "../../middleware/auth.middleware";
import * as service from "./notifications.service";
import { success } from "../../utils/response";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export async function listNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = querySchema.parse(req.query);
    const result = await service.listNotifications(req.user!.userId, query);
    success(res, result);
  } catch (err) { next(err); }
}

export async function getUnreadCount(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const count = await service.getUnreadCount(req.user!.userId);
    success(res, { count });
  } catch (err) { next(err); }
}

export async function markAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const notification = await service.markAsRead(req.user!.userId, id);
    success(res, { notification }, "Marked as read");
  } catch (err) { next(err); }
}

export async function markAllAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await service.markAllAsRead(req.user!.userId);
    success(res, result, "Marked all as read");
  } catch (err) { next(err); }
}

export async function deleteNotification(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await service.deleteNotification(req.user!.userId, id);
    success(res, null, "Notification deleted");
  } catch (err) { next(err); }
}
