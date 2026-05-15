import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import * as controller from "./wishlist.controller";
import type { RequestHandler } from "express";
import { z } from "zod";
import { validate } from "../../middleware/validate.middleware";

const router = Router();

const addSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

router.use(requireAuth as RequestHandler);

router.get("/", controller.getWishlist as unknown as RequestHandler);
router.post("/", validate(addSchema), controller.addToWishlist as unknown as RequestHandler);
router.delete("/:productId", controller.removeFromWishlist as unknown as RequestHandler);

export default router;
