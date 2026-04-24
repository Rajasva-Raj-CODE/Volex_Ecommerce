"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
/**
 * Validates req.body against the provided Zod schema.
 * On failure, passes a ZodError to next() which errorMiddleware handles.
 */
function validate(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            next(result.error);
            return;
        }
        req.body = result.data;
        next();
    };
}
//# sourceMappingURL=validate.middleware.js.map