"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpLimiter = exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/** General API rate limit — 100 requests per minute */
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please slow down." },
});
/** Auth endpoints — 10 attempts per 15 minutes */
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many login attempts, try again in 15 minutes." },
});
/** OTP endpoints — 5 requests per 15 minutes per IP */
exports.otpLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many OTP requests, try again in 15 minutes." },
});
//# sourceMappingURL=rateLimiter.js.map