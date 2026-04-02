import type { Request, Response, NextFunction } from "express";
import * as service from "./categories.service";
import { success } from "../../utils/response";
import type { AuthRequest } from "../../middleware/auth.middleware";

export async function listCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await service.listCategories();
    success(res, { categories });
  } catch (err) { next(err); }
}

export async function listCategoriesFlat(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await service.listCategoriesFlat();
    success(res, { categories });
  } catch (err) { next(err); }
}

export async function getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const category = await service.getCategory(id);
    success(res, { category });
  } catch (err) { next(err); }
}

export async function createCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await service.createCategory(req.body);
    success(res, { category }, "Category created", 201);
  } catch (err) { next(err); }
}

export async function updateCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const category = await service.updateCategory(id, req.body);
    success(res, { category }, "Category updated");
  } catch (err) { next(err); }
}

export async function deleteCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await service.deleteCategory(id);
    success(res, null, "Category deleted");
  } catch (err) { next(err); }
}
