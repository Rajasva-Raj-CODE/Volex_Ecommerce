"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const auth_schema_1 = require("./auth.schema");
const controller = __importStar(require("./auth.controller"));
const router = (0, express_1.Router)();
// POST /api/auth/login — Admin email + password login
router.post("/login", rateLimiter_1.authLimiter, (0, validate_middleware_1.validate)(auth_schema_1.adminLoginSchema), controller.adminLogin);
// POST /api/auth/refresh — Refresh access token
router.post("/refresh", (0, validate_middleware_1.validate)(auth_schema_1.refreshTokenSchema), controller.refreshToken);
// POST /api/auth/logout — Invalidate refresh token
router.post("/logout", controller.logout);
// GET /api/auth/me — Get current user (requires auth)
router.get("/me", auth_middleware_1.requireAuth, controller.getMe);
// POST /api/auth/customer/register — Customer registration
router.post("/customer/register", rateLimiter_1.authLimiter, (0, validate_middleware_1.validate)(auth_schema_1.customerRegisterSchema), controller.customerRegister);
// POST /api/auth/customer/login — Customer email + password login
router.post("/customer/login", rateLimiter_1.authLimiter, (0, validate_middleware_1.validate)(auth_schema_1.customerLoginSchema), controller.customerLogin);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map