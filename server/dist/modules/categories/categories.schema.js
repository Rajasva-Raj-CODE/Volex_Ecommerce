"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    slug: zod_1.z
        .string()
        .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only")
        .optional(),
    imageUrl: zod_1.z.string().url().optional(),
    parentId: zod_1.z.string().optional().nullable(),
    sortOrder: zod_1.z.coerce.number().int().default(0),
    isActive: zod_1.z.boolean().default(true),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
//# sourceMappingURL=categories.schema.js.map