import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
export declare function getAddresses(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function createAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function deleteAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=addresses.controller.d.ts.map