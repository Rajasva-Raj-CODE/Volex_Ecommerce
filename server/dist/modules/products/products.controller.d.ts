import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
export declare function listProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function deleteProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=products.controller.d.ts.map