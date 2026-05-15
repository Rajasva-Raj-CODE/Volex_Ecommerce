import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createCouponSchema, updateCouponSchema, validateCouponSchema } from "./coupons.schema";
import * as controller from "./coupons.controller";
import type { RequestHandler } from "express";

const router = Router();

// ─── Customer route ─────────────────────────────────────────────────────────

router.post(
  "/validate",
  requireAuth as RequestHandler,
  validate(validateCouponSchema),
  controller.validateCoupon as unknown as RequestHandler
);

// ─── Admin routes ───────────────────────────────────────────────────────────

router.get(
  "/",
  requireAuth as RequestHandler,
  requireRole("ADMIN", "STAFF") as RequestHandler,
  controller.listCoupons as unknown as RequestHandler
);

router.post(
  "/",
  requireAuth as RequestHandler,
  requireRole("ADMIN") as RequestHandler,
  validate(createCouponSchema),
  controller.createCoupon as unknown as RequestHandler
);

router.put(
  "/:id",
  requireAuth as RequestHandler,
  requireRole("ADMIN") as RequestHandler,
  validate(updateCouponSchema),
  controller.updateCoupon as unknown as RequestHandler
);

router.delete(
  "/:id",
  requireAuth as RequestHandler,
  requireRole("ADMIN") as RequestHandler,
  controller.deleteCoupon as unknown as RequestHandler
);

export default router;
