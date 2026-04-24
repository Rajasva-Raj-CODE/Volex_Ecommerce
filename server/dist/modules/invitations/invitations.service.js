"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteStaff = inviteStaff;
exports.listInvitations = listInvitations;
exports.revokeInvitation = revokeInvitation;
exports.requestOtp = requestOtp;
exports.verifyOtpAndLogin = verifyOtpAndLogin;
const prisma_1 = require("../../config/prisma");
const otp_1 = require("../../utils/otp");
const jwt_1 = require("../../utils/jwt");
const email_service_1 = require("../../services/email.service");
const error_middleware_1 = require("../../middleware/error.middleware");
const env_1 = require("../../config/env");
const crypto_1 = __importDefault(require("crypto"));
const REFRESH_TOKEN_EXPIRES_DAYS = 7;
// ─── Admin: Invite Staff ──────────────────────────────────────────────────────
async function inviteStaff(input, invitedById) {
    const { email, name } = input;
    const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existingUser && (existingUser.role !== "STAFF" || existingUser.isActive)) {
        throw new error_middleware_1.AppError("A user with this email already exists", 409);
    }
    // Check if invitation already exists
    const existingInvite = await prisma_1.prisma.invitation.findUnique({ where: { email } });
    if (existingInvite && !existingInvite.used) {
        throw new error_middleware_1.AppError("An invitation for this email already exists", 409);
    }
    // Get admin info for the email
    const admin = await prisma_1.prisma.user.findUnique({
        where: { id: invitedById },
        select: { name: true },
    });
    // Create the invitation record
    const invitation = await prisma_1.prisma.invitation.upsert({
        where: { email },
        update: { used: false, invitedById, createdAt: new Date() },
        create: { email, invitedById },
    });
    // Create a stub User record for the staff member
    await prisma_1.prisma.user.upsert({
        where: { email },
        update: { name: name ?? null, isActive: true, role: "STAFF" },
        create: {
            email,
            name: name ?? null,
            role: "STAFF",
            isActive: true,
        },
    });
    // Send invite email
    await (0, email_service_1.sendStaffInviteEmail)({
        toEmail: email,
        invitedByName: admin?.name ?? "Admin",
        adminUrl: env_1.env.ADMIN_URL,
    });
    return {
        id: invitation.id,
        email: invitation.email,
        createdAt: invitation.createdAt,
    };
}
// ─── List Invitations ─────────────────────────────────────────────────────────
async function listInvitations() {
    return prisma_1.prisma.invitation.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            invitedBy: { select: { name: true, email: true } },
        },
    });
}
// ─── Revoke Invitation ────────────────────────────────────────────────────────
async function revokeInvitation(id) {
    const invite = await prisma_1.prisma.invitation.findUnique({ where: { id } });
    if (!invite)
        throw new error_middleware_1.AppError("Invitation not found", 404);
    const staffUser = await prisma_1.prisma.user.findUnique({
        where: { email: invite.email },
        select: { id: true, role: true },
    });
    if (staffUser && staffUser.role !== "STAFF") {
        throw new error_middleware_1.AppError("Only staff invitations can be revoked from the team page", 400);
    }
    await prisma_1.prisma.$transaction(async (tx) => {
        if (staffUser) {
            await tx.refreshToken.deleteMany({ where: { userId: staffUser.id } });
            await tx.user.update({
                where: { id: staffUser.id },
                data: { isActive: false },
            });
        }
        await tx.invitation.delete({ where: { id } });
    });
}
// ─── Staff: Request OTP ───────────────────────────────────────────────────────
async function requestOtp(input) {
    const { email } = input;
    // Check invitation exists
    const invitation = await prisma_1.prisma.invitation.findUnique({ where: { email } });
    if (!invitation) {
        throw new error_middleware_1.AppError("No invitation found for this email. Ask your admin to invite you.", 403);
    }
    // Check the staff user exists and is active
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
        throw new error_middleware_1.AppError("Account is not active. Contact your admin.", 403);
    }
    // Invalidate any existing unused OTP sessions for this email
    await prisma_1.prisma.otpSession.deleteMany({
        where: { email, purpose: "STAFF_LOGIN", used: false },
    });
    // Generate new OTP
    const otp = (0, otp_1.generateOtp)();
    const otpHash = await (0, otp_1.hashOtp)(otp);
    await prisma_1.prisma.otpSession.create({
        data: {
            email,
            otpHash,
            purpose: "STAFF_LOGIN",
            expiresAt: (0, otp_1.otpExpiresAt)(),
        },
    });
    // Send OTP email
    await (0, email_service_1.sendOtpEmail)({ toEmail: email, otp });
    return { message: "OTP sent to your email" };
}
// ─── Staff: Verify OTP → Issue JWT ───────────────────────────────────────────
async function verifyOtpAndLogin(input) {
    const { email, otp } = input;
    // Find the most recent unused OTP session
    const session = await prisma_1.prisma.otpSession.findFirst({
        where: {
            email,
            purpose: "STAFF_LOGIN",
            used: false,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
    });
    if (!session) {
        throw new error_middleware_1.AppError("OTP has expired or is invalid. Request a new one.", 401);
    }
    // Verify OTP
    const isValid = await (0, otp_1.verifyOtp)(otp, session.otpHash);
    if (!isValid) {
        throw new error_middleware_1.AppError("Incorrect OTP. Please try again.", 401);
    }
    // Mark OTP as used
    await prisma_1.prisma.otpSession.update({
        where: { id: session.id },
        data: { used: true },
    });
    // Mark invitation as used (first login)
    await prisma_1.prisma.invitation.update({
        where: { email },
        data: { used: true },
    });
    // Get user
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new error_middleware_1.AppError("User not found", 404);
    // Issue tokens
    const accessToken = (0, jwt_1.signAccessToken)({ userId: user.id, role: user.role });
    const refreshToken = (0, jwt_1.signRefreshToken)({ userId: user.id, role: user.role });
    const tokenHash = crypto_1.default.createHash("sha256").update(refreshToken).digest("hex");
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
    await prisma_1.prisma.refreshToken.create({
        data: { tokenHash, userId: user.id, expiresAt },
    });
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
    };
}
//# sourceMappingURL=invitations.service.js.map