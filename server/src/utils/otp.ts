import crypto from "crypto";
import bcrypt from "bcryptjs";

const OTP_LENGTH = 6;
const BCRYPT_ROUNDS = 10;

/**
 * Generates a cryptographically secure 6-digit OTP string.
 */
export function generateOtp(): string {
  // Generate a random number between 100000–999999
  const buffer = crypto.randomBytes(4);
  const num = buffer.readUInt32BE(0) % 900000 + 100000;
  return num.toString().padStart(OTP_LENGTH, "0");
}

/**
 * Hashes the OTP using bcrypt so it's safe to store in DB.
 */
export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, BCRYPT_ROUNDS);
}

/**
 * Verifies a plaintext OTP against its stored bcrypt hash.
 */
export async function verifyOtp(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}

/**
 * Returns a Date 15 minutes from now — OTP expiry.
 */
export function otpExpiresAt(): Date {
  return new Date(Date.now() + 15 * 60 * 1000);
}
