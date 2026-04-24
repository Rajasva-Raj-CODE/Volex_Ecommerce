import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
export declare function getWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function addToWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function removeFromWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=wishlist.controller.d.ts.map