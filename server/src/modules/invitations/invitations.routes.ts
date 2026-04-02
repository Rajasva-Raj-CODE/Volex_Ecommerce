import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import { otpLimiter, authLimiter } from "../../middleware/rateLimiter";
import { sendInviteSchema, requestOtpSchema, verifyOtpSchema } from "./invitations.schema";
import * as controller from "./invitations.controller";
import type { RequestHandler } from "express";

const router = Router();

// ─── Admin-only: manage invitations ──────────────────────────────────────────

// POST /api/invitations — Admin sends invite
router.post(
  "/",
  requireAuth as RequestHandler,
  requireRole("ADMIN") as RequestHandler,
  validate(sendInviteSchema),
  controller.sendInvite as unknown as RequestHandler
);

// GET /api/invitations — List all invitations
router.get(
  "/",
  requireAuth as RequestHandler,
  requireRole("ADMIN") as RequestHandler,
  controller.listInvitations as unknown as RequestHandler
);

// DELETE /api/invitations/:id — Revoke invitation
router.delete(
  "/:id",
  requireAuth as RequestHandler,
  requireRole("ADMIN") as RequestHandler,
  controller.revokeInvitation as unknown as RequestHandler
);

// ─── Staff OTP login (public) ─────────────────────────────────────────────────

// POST /api/invitations/auth/request-otp — Staff requests OTP
router.post(
  "/auth/request-otp",
  otpLimiter,
  validate(requestOtpSchema),
  controller.requestOtp as unknown as RequestHandler
);

// POST /api/invitations/auth/verify-otp — Staff verifies OTP → JWT
router.post(
  "/auth/verify-otp",
  authLimiter,
  validate(verifyOtpSchema),
  controller.verifyOtp as unknown as RequestHandler
);

export default router;
