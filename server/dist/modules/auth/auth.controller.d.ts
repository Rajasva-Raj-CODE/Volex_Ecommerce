import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
export declare function adminLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function logout(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function customerRegister(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function customerLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map