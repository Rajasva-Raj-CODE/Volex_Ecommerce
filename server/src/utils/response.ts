import type { Response } from "express";

/**
 * Sends a standardised success response.
 * Usage: return success(res, { user }, "Logged in", 200);
 */
export function success<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Sends a standardised error response.
 * Usage: return error(res, "Email not found", 404);
 */
export function error(
  res: Response,
  message: string,
  statusCode = 400,
  code?: string
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(code && { code }),
  });
}
