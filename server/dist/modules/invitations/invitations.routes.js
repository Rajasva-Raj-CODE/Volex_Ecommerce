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
const requireRole_middleware_1 = require("../../middleware/requireRole.middleware");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const invitations_schema_1 = require("./invitations.schema");
const controller = __importStar(require("./invitations.controller"));
const router = (0, express_1.Router)();
// ─── Admin-only: manage invitations ──────────────────────────────────────────
// POST /api/invitations — Admin sends invite
router.post("/", auth_middleware_1.requireAuth, (0, requireRole_middleware_1.requireRole)("ADMIN"), (0, validate_middleware_1.validate)(invitations_schema_1.sendInviteSchema), controller.sendInvite);
// GET /api/invitations — List all invitations
router.get("/", auth_middleware_1.requireAuth, (0, requireRole_middleware_1.requireRole)("ADMIN"), controller.listInvitations);
// DELETE /api/invitations/:id — Revoke invitation
router.delete("/:id", auth_middleware_1.requireAuth, (0, requireRole_middleware_1.requireRole)("ADMIN"), controller.revokeInvitation);
// ─── Staff OTP login (public) ─────────────────────────────────────────────────
// POST /api/invitations/auth/request-otp — Staff requests OTP
router.post("/auth/request-otp", rateLimiter_1.otpLimiter, (0, validate_middleware_1.validate)(invitations_schema_1.requestOtpSchema), controller.requestOtp);
// POST /api/invitations/auth/verify-otp — Staff verifies OTP → JWT
router.post("/auth/verify-otp", rateLimiter_1.authLimiter, (0, validate_middleware_1.validate)(invitations_schema_1.verifyOtpSchema), controller.verifyOtp);
exports.default = router;
//# sourceMappingURL=invitations.routes.js.map