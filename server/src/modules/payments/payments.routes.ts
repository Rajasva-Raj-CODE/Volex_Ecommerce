import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { createRazorpayOrderSchema, verifyRazorpayPaymentSchema } from "./payments.schema";
import * as controller from "./payments.controller";
import type { RequestHandler } from "express";

const router = Router();

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
