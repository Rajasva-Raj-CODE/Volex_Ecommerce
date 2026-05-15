"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_1 = require("../utils/jwt");
const error_middleware_1 = require("./error.middleware");
/**
 * Verifies the JWT access token from the Authorization header.
 * Attaches decoded payload as req.user.
 */
function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return next(new error_middleware_1.AppError("No token provided", 401, "UNAUTHORIZED"));
    }
    const token = header.slice(7);
    try {
        req.user = (0, jwt_1.verifyAccessToken)(token);
        next();
    }
    catch {
        next(new error_middleware_1.AppError("Invalid or expired token", 401, "UNAUTHORIZED"));
    }
}
//# sourceMappingURL=auth.middleware.js.map