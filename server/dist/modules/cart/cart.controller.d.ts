import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
export declare function getCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function addToCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateCartItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function removeFromCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function clearCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=cart.controller.d.ts.map