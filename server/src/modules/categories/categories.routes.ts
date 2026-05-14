import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import { createCategorySchema, updateCategorySchema } from "./categories.schema";
import * as controller from "./categories.controller";
import type { RequestHandler } from "express";

const router = Router();

// GET /api/categories — public: tree structure
router.get("/", controller.listCategories);

// GET /api/categories/flat — public: flat list for dropdowns
router.get("/flat", controller.listCategoriesFlat);

router.get(
  "/admin",
  requireAuth as RequestHandler,
  requireRole("ADMIN", "STAFF") as RequestHandler,
  controller.listCategoriesAdmin as unknown as RequestHandler
);

// GET /api/categories/:id — public: single category
router.get("/:id", controller.getCategory);

// POST /api/categories — ADMIN only
router.post(
  "/",
  requireAuth as RequestHandler,
  requireRole("ADMIN") as RequestHandler,
  validate(createCategorySchema),
  controller.createCategory as unknown as RequestHandler
);

// PUT /api/categories/:id — ADMIN only
router.put(
  "/:id",
  requireAuth as RequestHandler,
  requireRole("ADMIN") as RequestHandler,
  validate(updateCategorySchema),
  controller.updateCategory as unknown as RequestHandler
);

// DELETE /api/categories/:id — ADMIN only
router.delete(
  "/:id",
  requireAuth as RequestHandler,
  requireRole("ADMIN") as RequestHandler,
  controller.deleteCategory as unknown as RequestHandler
);

export default router;
