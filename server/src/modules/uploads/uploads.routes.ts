import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import { uploadImageSchema } from "./uploads.schema";
import * as controller from "./uploads.controller";
import type { RequestHandler } from "express";

const router = Router();

router.post(
  "/image",
  requireAuth as RequestHandler,
  requireRole("ADMIN", "STAFF") as RequestHandler,
  validate(uploadImageSchema),
  controller.uploadImage as unknown as RequestHandler
);

export default router;
