import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createReviewSchema, updateReviewStatusSchema } from "./reviews.schema";
import * as controller from "./reviews.controller";
import type { RequestHandler } from "express";

const router = Router();

// ─── Public routes ──────────────────────────────────────────────────────────

router.get(
  "/products/:productId",
  controller.getProductReviews as unknown as RequestHandler
);

// ─── Customer routes ────────────────────────────────────────────────────────

router.post(
  "/products/:productId",
  requireAuth as RequestHandler,
  validate(createReviewSchema),
  controller.createReview as unknown as RequestHandler
);

// ─── Admin routes ───────────────────────────────────────────────────────────

router.get(
  "/",
  requireAuth as RequestHandler,
  requireRole("ADMIN", "STAFF") as RequestHandler,
  controller.listAllReviews as unknown as RequestHandler
);

router.put(
  "/:id/status",
  requireAuth as RequestHandler,
  requireRole("ADMIN", "STAFF") as RequestHandler,
  validate(updateReviewStatusSchema),
  controller.updateReviewStatus as unknown as RequestHandler
);

router.delete(
  "/:id",
  requireAuth as RequestHandler,
  requireRole("ADMIN") as RequestHandler,
  controller.deleteReview as unknown as RequestHandler
);

export default router;
