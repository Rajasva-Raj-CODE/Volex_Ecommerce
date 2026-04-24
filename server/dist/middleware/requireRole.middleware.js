"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const error_middleware_1 = require("./error.middleware");
/**
 * Role guard — use after requireAuth.
 * Usage: router.delete("/...", requireAuth, requireRole("ADMIN"), handler)
 */
function requireRole(...allowed) {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new error_middleware_1.AppError("Not authenticated", 401, "UNAUTHORIZED"));
        }
        if (!allowed.includes(req.user.role)) {
            return next(new error_middleware_1.AppError("You do not have permission", 403, "FORBIDDEN"));
        }
        next();
    };
}
//# sourceMappingURL=requireRole.middleware.js.map