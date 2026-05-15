export interface JwtPayload {
    userId: string;
    role: "ADMIN" | "STAFF" | "CUSTOMER";
}
/**
 * Signs a short-lived access token (default 15 minutes).
 */
export declare function signAccessToken(payload: JwtPayload): string;
/**
 * Signs a long-lived refresh token (default 7 days).
 */
export declare function signRefreshToken(payload: JwtPayload): string;
/**
 * Verifies an access token. Returns the decoded payload or throws.
 */
export declare function verifyAccessToken(token: string): JwtPayload;
/**
 * Verifies a refresh token. Returns the decoded payload or throws.
 */
export declare function verifyRefreshToken(token: string): JwtPayload;
//# sourceMappingURL=jwt.d.ts.map