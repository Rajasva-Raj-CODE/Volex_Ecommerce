import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
/**
 * Validates req.body against the provided Zod schema.
 * On failure, passes a ZodError to next() which errorMiddleware handles.
 */
export declare function validate(schema: ZodSchema): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.middleware.d.ts.map