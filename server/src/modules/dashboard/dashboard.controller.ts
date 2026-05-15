import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
import { success } from "../../utils/response";
import * as service from "./dashboard.service";

export async function getSummary(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const summary = await service.getDashboardSummary();
    success(res, summary);
  } catch (err) {
    next(err);
  }
}
