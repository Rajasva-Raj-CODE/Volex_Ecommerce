import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
export declare function listCategories(_req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function listCategoriesFlat(_req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function deleteCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=categories.controller.d.ts.map