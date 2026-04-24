import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { authLimiter } from "../../middleware/rateLimiter";
import { adminLoginSchema, refreshTokenSchema, customerRegisterSchema, customerLoginSchema } from "./auth.schema";
import * as controller from "./auth.controller";
import type { AuthRequest } from "../../middleware/auth.middleware";
import type { RequestHandler } from "express";

const router = Router();

// POST /api/auth/login — Admin email + password login
router.post(
  "/login",
  authLimiter,
  validate(adminLoginSchema),
  controller.adminLogin
);

// POST /api/auth/refresh — Refresh access token
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  controller.refreshToken
);

// POST /api/auth/logout — Invalidate refresh token
router.post(
  "/logout",
  controller.logout
);

// GET /api/auth/me — Get current user (requires auth)
router.get(
  "/me",
  requireAuth as RequestHandler,
  controller.getMe as unknown as RequestHandler
);

// POST /api/auth/customer/register — Customer registration
router.post(
  "/customer/register",
  authLimiter,
  validate(customerRegisterSchema),
  controller.customerRegister
);

// POST /api/auth/customer/login — Customer email + password login
router.post(
  "/customer/login",
  authLimiter,
  validate(customerLoginSchema),
  controller.customerLogin
);

export default router;
