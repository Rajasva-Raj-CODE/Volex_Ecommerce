import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
export declare function placeOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getUserOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function listAllOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=orders.controller.d.ts.map