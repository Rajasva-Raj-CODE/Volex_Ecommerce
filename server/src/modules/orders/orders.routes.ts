import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import { placeOrderSchema, updateOrderStatusSchema } from "./orders.schema";
import * as controller from "./orders.controller";
import type { RequestHandler } from "express";

const router = Router();

router.use(requireAuth as RequestHandler);

// Customer routes
router.post("/", validate(placeOrderSchema), controller.placeOrder as unknown as RequestHandler);
router.get("/my", controller.getUserOrders as unknown as RequestHandler);
router.get("/:id", controller.getOrder as unknown as RequestHandler);

// Admin / Staff routes
router.get(
  "/",
  requireRole("ADMIN", "STAFF") as RequestHandler,
  controller.listAllOrders as unknown as RequestHandler
);
router.put(
  "/:id/status",
  requireRole("ADMIN", "STAFF") as RequestHandler,
  validate(updateOrderStatusSchema),
  controller.updateOrderStatus as unknown as RequestHandler
);

export default router;
