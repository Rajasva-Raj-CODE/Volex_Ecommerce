import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { createRazorpayOrderSchema, verifyRazorpayPaymentSchema } from "./payments.schema";
import * as controller from "./payments.controller";
import type { RequestHandler } from "express";

const router = Router();

// ─── Public: Razorpay webhook ─────────────────────────────────────────────────
// Mounted before `requireAuth` — Razorpay has no JWT. Authenticity comes from the
// HMAC signature over the raw body instead.
router.post("/razorpay/webhook", controller.razorpayWebhook as RequestHandler);

// ─── Everything below requires a signed-in customer ──────────────────────────
router.use(requireAuth as RequestHandler);

router.post(
  "/razorpay/order",
  validate(createRazorpayOrderSchema),
  controller.createRazorpayOrder as unknown as RequestHandler
);

router.post(
  "/razorpay/verify",
  validate(verifyRazorpayPaymentSchema),
  controller.verifyRazorpayPayment as unknown as RequestHandler
);

export default router;
