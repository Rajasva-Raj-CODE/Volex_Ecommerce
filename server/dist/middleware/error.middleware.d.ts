import type { Request, Response, NextFunction } from "express";
export declare class AppError extends Error {
    message: string;
    statusCode: number;
    code?: string | undefined;
    constructor(message: string, statusCode?: number, code?: string | undefined);
}
export declare function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=error.middleware.d.ts.map