import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { success } from "../../utils/response";
import type { AuthRequest } from "../../middleware/auth.middleware";


export async function adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tokens = await authService.adminLogin(req.body);
    success(res, tokens, "Logged in successfully");
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body as { refreshToken: string };
    const tokens = await authService.refreshTokens(refreshToken);
    success(res, tokens, "Tokens refreshed");
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body as { refreshToken: string };
    if (refreshToken) await authService.logout(refreshToken);
    success(res, null, "Logged out");
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.getMe(req.user!.userId);
    success(res, { user });
  } catch (err) {
    next(err);
  }
}

export async function customerRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tokens = await authService.customerRegister(req.body);
    success(res, tokens, "Account created successfully", 201);
  } catch (err) {
    next(err);
  }
}

export async function customerLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tokens = await authService.customerLogin(req.body);
    success(res, tokens, "Logged in successfully");
  } catch (err) {
    next(err);
  }
}
