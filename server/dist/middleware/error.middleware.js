"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorMiddleware = errorMiddleware;
const zod_1 = require("zod");
class AppError extends Error {
    message;
    statusCode;
    code;
    constructor(message, statusCode = 400, code) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        this.name = "AppError";
    }
}
exports.AppError = AppError;
function errorMiddleware(err, _req, res, _next) {
    // Zod validation error
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: err.flatten().fieldErrors,
        });
        return;
    }
    // Known application error
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.code && { code: err.code }),
        });
        return;
    }
    // Unknown error
    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}
//# sourceMappingURL=error.middleware.js.map