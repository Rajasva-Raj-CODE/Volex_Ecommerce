import type { Request, Response, NextFunction } from "express";
import { type JwtPayload } from "../utils/jwt";
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
/**
 * Verifies the JWT access token from the Authorization header.
 * Attaches decoded payload as req.user.
 */
export declare function requireAuth(req: AuthRequest, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map