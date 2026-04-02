import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import { createProductSchema, updateProductSchema } from "./products.schema";
import * as controller from "./products.controller";
import type { RequestHandler } from "express";

const router = Router();

// GET /api/products — public: list with filters + pagination
router.get("/", controller.listProducts);

// GET /api/products/:id — public: single product by id or slug
router.get("/:id", controller.getProduct);

// POST /api/products — ADMIN or STAFF only
router.post(
  "/",
  requireAuth as RequestHandler,
  requireRole("ADMIN", "STAFF") as RequestHandler,
  validate(createProductSchema),
  controller.createProduct as unknown as RequestHandler
);

// PUT /api/products/:id — ADMIN or STAFF only
router.put(
  "/:id",
  requireAuth as RequestHandler,
  requireRole("ADMIN", "STAFF") as RequestHandler,
  validate(updateProductSchema),
  controller.updateProduct as unknown as RequestHandler
);

// DELETE /api/products/:id — ADMIN only
router.delete(
  "/:id",
  requireAuth as RequestHandler,
  requireRole("ADMIN") as RequestHandler,
  controller.deleteProduct as unknown as RequestHandler
);

export default router;
