import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import * as controller from "./users.controller";
import type { RequestHandler } from "express";

const router = Router();

router.get(
  "/",
  requireAuth as RequestHandler,
  requireRole("ADMIN", "STAFF") as RequestHandler,
  controller.listCustomers as unknown as RequestHandler
);

export default router;
