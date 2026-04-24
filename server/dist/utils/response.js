"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = success;
exports.error = error;
/**
 * Sends a standardised success response.
 * Usage: return success(res, { user }, "Logged in", 200);
 */
function success(res, data, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}
/**
 * Sends a standardised error response.
 * Usage: return error(res, "Email not found", 404);
 */
function error(res, message, statusCode = 400, code) {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(code && { code }),
    });
}
//# sourceMappingURL=response.js.map