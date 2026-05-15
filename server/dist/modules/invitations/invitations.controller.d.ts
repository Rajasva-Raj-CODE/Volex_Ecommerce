import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
export declare function sendInvite(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function listInvitations(_req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function revokeInvitation(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function requestOtp(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function verifyOtp(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=invitations.controller.d.ts.map