import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware";
import { AppError } from "./error.middleware";

type Role = "ADMIN" | "STAFF" | "CUSTOMER";

/**
 * Role guard — use after requireAuth.
 * Usage: router.delete("/...", requireAuth, requireRole("ADMIN"), handler)
 */
export function requireRole(...allowed: Role[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401, "UNAUTHORIZED"));
    }
    if (!allowed.includes(req.user.role)) {
      return next(new AppError("You do not have permission", 403, "FORBIDDEN"));
    }
    next();
  };
}
