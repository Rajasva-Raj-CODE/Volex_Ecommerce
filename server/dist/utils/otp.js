"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = generateOtp;
exports.hashOtp = hashOtp;
exports.verifyOtp = verifyOtp;
exports.otpExpiresAt = otpExpiresAt;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const OTP_LENGTH = 6;
const BCRYPT_ROUNDS = 10;
/**
 * Generates a cryptographically secure 6-digit OTP string.
 */
function generateOtp() {
    // Generate a random number between 100000–999999
    const buffer = crypto_1.default.randomBytes(4);
    const num = buffer.readUInt32BE(0) % 900000 + 100000;
    return num.toString().padStart(OTP_LENGTH, "0");
}
/**
 * Hashes the OTP using bcrypt so it's safe to store in DB.
 */
async function hashOtp(otp) {
    return bcryptjs_1.default.hash(otp, BCRYPT_ROUNDS);
}
/**
 * Verifies a plaintext OTP against its stored bcrypt hash.
 */
async function verifyOtp(otp, hash) {
    return bcryptjs_1.default.compare(otp, hash);
}
/**
 * Returns a Date 15 minutes from now — OTP expiry.
 */
function otpExpiresAt() {
    return new Date(Date.now() + 15 * 60 * 1000);
}
//# sourceMappingURL=otp.js.map