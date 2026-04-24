import type { Response } from "express";
/**
 * Sends a standardised success response.
 * Usage: return success(res, { user }, "Logged in", 200);
 */
export declare function success<T>(res: Response, data: T, message?: string, statusCode?: number): Response;
/**
 * Sends a standardised error response.
 * Usage: return error(res, "Email not found", 404);
 */
export declare function error(res: Response, message: string, statusCode?: number, code?: string): Response;
//# sourceMappingURL=response.d.ts.map