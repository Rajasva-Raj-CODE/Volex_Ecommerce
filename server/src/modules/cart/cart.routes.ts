import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { addToCartSchema, updateCartSchema } from "./cart.schema";
import * as controller from "./cart.controller";
import type { RequestHandler } from "express";

const router = Router();

// All cart routes require authentication
router.use(requireAuth as RequestHandler);

router.get("/", controller.getCart as unknown as RequestHandler);
router.post("/", validate(addToCartSchema), controller.addToCart as unknown as RequestHandler);
router.put("/:productId", validate(updateCartSchema), controller.updateCartItem as unknown as RequestHandler);
router.delete("/clear", controller.clearCart as unknown as RequestHandler);
router.delete("/:productId", controller.removeFromCart as unknown as RequestHandler);

export default router;
