import { prisma } from "../../config/prisma";
import { generateOtp, hashOtp, verifyOtp, otpExpiresAt } from "../../utils/otp";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { sendStaffInviteEmail, sendOtpEmail } from "../../services/email.service";
import { AppError } from "../../middleware/error.middleware";
import { env } from "../../config/env";
import crypto from "crypto";
import type { SendInviteInput, RequestOtpInput, VerifyOtpInput } from "./invitations.schema";

const REFRESH_TOKEN_EXPIRES_DAYS = 7;

// ─── Admin: Invite Staff ──────────────────────────────────────────────────────

export async function inviteStaff(input: SendInviteInput, invitedById: string) {
  const { email, name } = input;

  // Check if user already exists and is active staff
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("A user with this email already exists", 409);
  }

  // Check if invitation already exists
  const existingInvite = await prisma.invitation.findUnique({ where: { email } });
  if (existingInvite && !existingInvite.used) {
    throw new AppError("An invitation for this email already exists", 409);
  }

  // Get admin info for the email
  const admin = await prisma.user.findUnique({
    where: { id: invitedById },
    select: { name: true },
  });

  // Create the invitation record
  const invitation = await prisma.invitation.upsert({
    where: { email },
    update: { used: false, invitedById, createdAt: new Date() },
    create: { email, invitedById },
  });

  // Create a stub User record for the staff member
  await prisma.user.upsert({
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
  await sendStaffInviteEmail({
    toEmail: email,
    invitedByName: admin?.name ?? "Admin",
    adminUrl: env.ADMIN_URL,
  });

  return {
    id: invitation.id,
    email: invitation.email,
    createdAt: invitation.createdAt,
  };
}

// ─── List Invitations ─────────────────────────────────────────────────────────

export async function listInvitations() {
  return prisma.invitation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      invitedBy: { select: { name: true, email: true } },
    },
  });
}

// ─── Revoke Invitation ────────────────────────────────────────────────────────

export async function revokeInvitation(id: string) {
  const invite = await prisma.invitation.findUnique({ where: { id } });
  if (!invite) throw new AppError("Invitation not found", 404);
  if (invite.used) throw new AppError("Cannot revoke an already accepted invitation", 400);

  // Deactivate the staff user too
  await prisma.user.update({
    where: { email: invite.email },
    data: { isActive: false },
  });

  await prisma.invitation.delete({ where: { id } });
}

// ─── Staff: Request OTP ───────────────────────────────────────────────────────

export async function requestOtp(input: RequestOtpInput) {
  const { email } = input;

  // Check invitation exists
  const invitation = await prisma.invitation.findUnique({ where: { email } });
  if (!invitation) {
    throw new AppError("No invitation found for this email. Ask your admin to invite you.", 403);
  }

  // Check the staff user exists and is active
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    throw new AppError("Account is not active. Contact your admin.", 403);
  }

  // Invalidate any existing unused OTP sessions for this email
  await prisma.otpSession.deleteMany({
    where: { email, purpose: "STAFF_LOGIN", used: false },
  });

  // Generate new OTP
  const otp = generateOtp();
  const otpHash = await hashOtp(otp);

  await prisma.otpSession.create({
    data: {
      email,
      otpHash,
      purpose: "STAFF_LOGIN",
      expiresAt: otpExpiresAt(),
    },
  });

  // Send OTP email
  await sendOtpEmail({ toEmail: email, otp });

  return { message: "OTP sent to your email" };
}

// ─── Staff: Verify OTP → Issue JWT ───────────────────────────────────────────

export async function verifyOtpAndLogin(input: VerifyOtpInput) {
  const { email, otp } = input;

  // Find the most recent unused OTP session
  const session = await prisma.otpSession.findFirst({
    where: {
      email,
      purpose: "STAFF_LOGIN",
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!session) {
    throw new AppError("OTP has expired or is invalid. Request a new one.", 401);
  }

  // Verify OTP
  const isValid = await verifyOtp(otp, session.otpHash);
  if (!isValid) {
    throw new AppError("Incorrect OTP. Please try again.", 401);
  }

  // Mark OTP as used
  await prisma.otpSession.update({
    where: { id: session.id },
    data: { used: true },
  });

  // Mark invitation as used (first login)
  await prisma.invitation.update({
    where: { email },
    data: { used: true },
  });

  // Get user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("User not found", 404);

  // Issue tokens
  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
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
