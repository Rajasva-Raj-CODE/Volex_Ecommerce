import { Router } from "express";
import type { RequestHandler } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import * as controller from "./notifications.controller";

const router = Router();

router.use(requireAuth as RequestHandler);

router.get("/", controller.listNotifications as unknown as RequestHandler);
router.get("/unread-count", controller.getUnreadCount as unknown as RequestHandler);
router.put("/read-all", controller.markAllAsRead as unknown as RequestHandler);
router.put("/:id/read", controller.markAsRead as unknown as RequestHandler);
router.delete("/:id", controller.deleteNotification as unknown as RequestHandler);

export default router;
