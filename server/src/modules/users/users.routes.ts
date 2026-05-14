import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import { validate } from "../../middleware/validate.middleware";
import { updateProfileSchema, changePasswordSchema } from "./users.schema";
import * as controller from "./users.controller";
import type { RequestHandler } from "express";

const router = Router();

// ─── Authenticated user routes (before admin routes) ─────────────────────────

router.put(
  "/profile",
  requireAuth as RequestHandler,
  validate(updateProfileSchema),
  controller.updateProfile as unknown as RequestHandler
);

router.put(
  "/change-password",
  requireAuth as RequestHandler,
  validate(changePasswordSchema),
  controller.changePassword as unknown as RequestHandler
);

// ─── Admin routes ────────────────────────────────────────────────────────────

router.get(
  "/",
  requireAuth as RequestHandler,
  requireRole("ADMIN", "STAFF") as RequestHandler,
  controller.listCustomers as unknown as RequestHandler
);

export default router;
