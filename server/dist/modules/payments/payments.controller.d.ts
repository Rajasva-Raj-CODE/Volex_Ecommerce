import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
export declare function createRazorpayOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function verifyRazorpayPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=payments.controller.d.ts.map