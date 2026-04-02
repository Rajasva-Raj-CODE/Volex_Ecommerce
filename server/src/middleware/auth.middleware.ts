import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, type JwtPayload } from "../utils/jwt";
import { AppError } from "./error.middleware";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * Verifies the JWT access token from the Authorization header.
 * Attaches decoded payload as req.user.
 */
export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new AppError("No token provided", 401, "UNAUTHORIZED"));
  }

  const token = header.slice(7);

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401, "UNAUTHORIZED"));
  }
}
