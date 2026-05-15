import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
import * as service from "./invitations.service";
import { success } from "../../utils/response";

export async function sendInvite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const invitation = await service.inviteStaff(req.body, req.user!.userId);
    success(res, { invitation }, "Invitation sent", 201);
  } catch (err) {
    next(err);
  }
}

export async function listInvitations(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const invitations = await service.listInvitations();
    success(res, { invitations });
  } catch (err) {
    next(err);
  }
}

export async function revokeInvitation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await service.revokeInvitation(id);
    success(res, null, "Team member removed");
  } catch (err) {
    next(err);
  }
}

export async function requestOtp(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await service.requestOtp(req.body);
    success(res, result, "OTP sent to your email");
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await service.verifyOtpAndLogin(req.body);
    success(res, result, "Logged in successfully");
  } catch (err) {
    next(err);
  }
}
