/**
 * Generates a cryptographically secure 6-digit OTP string.
 */
export declare function generateOtp(): string;
/**
 * Hashes the OTP using bcrypt so it's safe to store in DB.
 */
export declare function hashOtp(otp: string): Promise<string>;
/**
 * Verifies a plaintext OTP against its stored bcrypt hash.
 */
export declare function verifyOtp(otp: string, hash: string): Promise<boolean>;
/**
 * Returns a Date 15 minutes from now — OTP expiry.
 */
export declare function otpExpiresAt(): Date;
//# sourceMappingURL=otp.d.ts.map