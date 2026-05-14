import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
import { success } from "../../utils/response";
import * as service from "./uploads.service";

export async function uploadImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const image = await service.uploadImage(req.body);
    success(res, { image }, "Image uploaded", 201);
  } catch (err) {
    next(err);
  }
}
