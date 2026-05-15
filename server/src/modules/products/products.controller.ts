import type { Request, Response, NextFunction } from "express";
import * as service from "./products.service";
import { productQuerySchema } from "./products.schema";
import { success } from "../../utils/response";
import type { AuthRequest } from "../../middleware/auth.middleware";

export async function listProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = productQuerySchema.parse(req.query);
    const result = await service.listProducts(query);
    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await service.getProduct(id);
    success(res, { product });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await service.createProduct(req.body);
    success(res, { product }, "Product created", 201);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await service.updateProduct(id, req.body);
    success(res, { product }, "Product updated");
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await service.deleteProduct(id);
    success(res, null, "Product deleted");
  } catch (err) {
    next(err);
  }
}
