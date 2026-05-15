import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
import * as service from "./wishlist.service";
import { success } from "../../utils/response";

export async function getWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const wishlist = await service.getWishlist(req.user!.userId);
    success(res, wishlist);
  } catch (err) { next(err); }
}

export async function addToWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { productId } = req.body as { productId: string };
    const item = await service.addToWishlist(req.user!.userId, productId);
    success(res, { item }, "Added to wishlist", 201);
  } catch (err) { next(err); }
}

export async function removeFromWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
    await service.removeFromWishlist(req.user!.userId, productId);
    success(res, null, "Removed from wishlist");
  } catch (err) { next(err); }
}
