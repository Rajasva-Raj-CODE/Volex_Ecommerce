"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = adminLogin;
exports.refreshTokens = refreshTokens;
exports.logout = logout;
exports.getMe = getMe;
exports.customerRegister = customerRegister;
exports.customerLogin = customerLogin;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../../config/prisma");
const jwt_1 = require("../../utils/jwt");
const error_middleware_1 = require("../../middleware/error.middleware");
const REFRESH_TOKEN_EXPIRES_DAYS = 7;
// ─── Admin Login ──────────────────────────────────────────────────────────────
async function adminLogin(input) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email: input.email } });
    if (!user || user.role !== "ADMIN") {
        throw new error_middleware_1.AppError("Invalid email or password", 401);
    }
    if (!user.isActive) {
        throw new error_middleware_1.AppError("Account is disabled", 403);
    }
    if (!user.passwordHash) {
        throw new error_middleware_1.AppError("Invalid email or password", 401);
    }
    const passwordOk = await bcryptjs_1.default.compare(input.password, user.passwordHash);
    if (!passwordOk) {
        throw new error_middleware_1.AppError("Invalid email or password", 401);
    }
    return issueTokens(user.id, user.role);
}
// ─── Token Refresh ────────────────────────────────────────────────────────────
async function refreshTokens(rawRefreshToken) {
    // Verify JWT signature first
    let payload;
    try {
        payload = (0, jwt_1.verifyRefreshToken)(rawRefreshToken);
    }
    catch {
        throw new error_middleware_1.AppError("Invalid or expired refresh token", 401);
    }
    // Find stored token by hash
    const tokenHash = hashToken(rawRefreshToken);
    const stored = await prisma_1.prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!stored || stored.expiresAt < new Date()) {
        throw new error_middleware_1.AppError("Refresh token not found or expired", 401);
    }
    // Rotate: delete old, issue new
    await prisma_1.prisma.refreshToken.delete({ where: { tokenHash } });
    return issueTokens(payload.userId, payload.role);
}
// ─── Logout ───────────────────────────────────────────────────────────────────
async function logout(rawRefreshToken) {
    const tokenHash = hashToken(rawRefreshToken);
    await prisma_1.prisma.refreshToken.deleteMany({ where: { tokenHash } });
}
// ─── Get Current User ─────────────────────────────────────────────────────────
async function getMe(userId) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    if (!user)
        throw new error_middleware_1.AppError("User not found", 404);
    return user;
}
// ─── Customer Register ────────────────────────────────────────────────────────
async function customerRegister(input) {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
        throw new error_middleware_1.AppError("Email already in use", 409);
    }
    const passwordHash = await bcryptjs_1.default.hash(input.password, 12);
    const user = await prisma_1.prisma.user.create({
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
async function customerLogin(input) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email: input.email } });
    if (!user || user.role !== "CUSTOMER") {
        throw new error_middleware_1.AppError("Invalid email or password", 401);
    }
    if (!user.isActive) {
        throw new error_middleware_1.AppError("Account is disabled", 403);
    }
    if (!user.passwordHash) {
        throw new error_middleware_1.AppError("Invalid email or password", 401);
    }
    const passwordOk = await bcryptjs_1.default.compare(input.password, user.passwordHash);
    if (!passwordOk) {
        throw new error_middleware_1.AppError("Invalid email or password", 401);
    }
    return issueTokens(user.id, "CUSTOMER");
}
// ─── Helpers ─────────────────────────────────────────────────────────────────
async function issueTokens(userId, role) {
    const accessToken = (0, jwt_1.signAccessToken)({ userId, role });
    const refreshToken = (0, jwt_1.signRefreshToken)({ userId, role });
    // Store hashed refresh token
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
    await prisma_1.prisma.refreshToken.create({
        data: { tokenHash, userId, expiresAt },
    });
    return { accessToken, refreshToken };
}
function hashToken(token) {
    return crypto_1.default.createHash("sha256").update(token).digest("hex");
}
//# sourceMappingURL=auth.service.js.map