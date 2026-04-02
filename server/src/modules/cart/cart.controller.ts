import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
import * as service from "./cart.service";
import { success } from "../../utils/response";

export async function getCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const cart = await service.getCart(req.user!.userId);
    success(res, cart);
  } catch (err) { next(err); }
}

export async function addToCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { productId, quantity } = req.body as { productId: string; quantity: number };
    const item = await service.addToCart(req.user!.userId, productId, quantity);
    success(res, { item }, "Added to cart", 201);
  } catch (err) { next(err); }
}

export async function updateCartItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
    const { quantity } = req.body as { quantity: number };
    const item = await service.updateCartItem(req.user!.userId, productId, quantity);
    success(res, { item }, "Cart updated");
  } catch (err) { next(err); }
}

export async function removeFromCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
    await service.removeFromCart(req.user!.userId, productId);
    success(res, null, "Item removed from cart");
  } catch (err) { next(err); }
}

export async function clearCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await service.clearCart(req.user!.userId);
    success(res, null, "Cart cleared");
  } catch (err) { next(err); }
}
