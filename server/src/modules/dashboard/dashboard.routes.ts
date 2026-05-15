import { Router, type RequestHandler } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import * as controller from "./dashboard.controller";

const router = Router();

router.use(requireAuth as RequestHandler);
router.get("/summary", requireRole("ADMIN", "STAFF") as RequestHandler, controller.getSummary as RequestHandler);

export default router;
