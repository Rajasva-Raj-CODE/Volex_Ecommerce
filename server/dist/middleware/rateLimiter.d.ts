/** General API rate limit — 100 requests per minute */
export declare const generalLimiter: import("express-rate-limit").RateLimitRequestHandler;
/** Auth endpoints — 10 attempts per 15 minutes */
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
/** OTP endpoints — 5 requests per 15 minutes per IP */
export declare const otpLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rateLimiter.d.ts.map