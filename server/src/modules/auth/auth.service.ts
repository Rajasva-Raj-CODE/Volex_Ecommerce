import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../../config/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { AppError } from "../../middleware/error.middleware";
import type { AdminLoginInput, CustomerRegisterInput, CustomerLoginInput } from "./auth.schema";

const REFRESH_TOKEN_EXPIRES_DAYS = 7;

// ─── Admin Login ──────────────────────────────────────────────────────────────

export async function adminLogin(input: AdminLoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user || user.role !== "ADMIN") {
    throw new AppError("Invalid email or password", 401);
  }
  if (!user.isActive) {
    throw new AppError("Account is disabled", 403);
  }
  if (!user.passwordHash) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordOk = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordOk) {
    throw new AppError("Invalid email or password", 401);
  }

  return issueTokens(user.id, user.role);
}

// ─── Token Refresh ────────────────────────────────────────────────────────────

export async function refreshTokens(rawRefreshToken: string) {
  // Verify JWT signature first
  let payload: ReturnType<typeof verifyRefreshToken>;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  // Find stored token by hash
  const tokenHash = hashToken(rawRefreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError("Refresh token not found or expired", 401);
  }

  // Rotate: delete old, issue new
  await prisma.refreshToken.delete({ where: { tokenHash } });
  return issueTokens(payload.userId, payload.role);
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(rawRefreshToken: string): Promise<void> {
  const tokenHash = hashToken(rawRefreshToken);
  await prisma.refreshToken.deleteMany({ where: { tokenHash } });
}

// ─── Get Current User ─────────────────────────────────────────────────────────

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  if (!user) throw new AppError("User not found", 404);
  return user;
}

// ─── Customer Register ────────────────────────────────────────────────────────

export async function customerRegister(input: CustomerRegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name ?? null,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  return issueTokens(user.id, "CUSTOMER");
}

// ─── Customer Login ───────────────────────────────────────────────────────────

export async function customerLogin(input: CustomerLoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user || user.role !== "CUSTOMER") {
    throw new AppError("Invalid email or password", 401);
  }
  if (!user.isActive) {
    throw new AppError("Account is disabled", 403);
  }
  if (!user.passwordHash) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordOk = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordOk) {
    throw new AppError("Invalid email or password", 401);
  }

  return issueTokens(user.id, "CUSTOMER");
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function issueTokens(userId: string, role: "ADMIN" | "STAFF" | "CUSTOMER") {
  const accessToken = signAccessToken({ userId, role });
  const refreshToken = signRefreshToken({ userId, role });

  // Store hashed refresh token
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: { tokenHash, userId, expiresAt },
  });

  return { accessToken, refreshToken };
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
