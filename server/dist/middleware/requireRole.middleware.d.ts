import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware";
type Role = "ADMIN" | "STAFF" | "CUSTOMER";
/**
 * Role guard — use after requireAuth.
 * Usage: router.delete("/...", requireAuth, requireRole("ADMIN"), handler)
 */
export declare function requireRole(...allowed: Role[]): (req: AuthRequest, _res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=requireRole.middleware.d.ts.map