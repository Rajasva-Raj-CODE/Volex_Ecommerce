"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
const productHighlightSchema = zod_1.z.object({ text: zod_1.z.string().min(1) });
const productSpecGroupSchema = zod_1.z.object({
    groupName: zod_1.z.string().min(1),
    specs: zod_1.z.array(zod_1.z.object({ label: zod_1.z.string().min(1), value: zod_1.z.string().min(1) })),
});
const productOverviewSchema = zod_1.z.object({
    heading: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
});
const productVariantGroupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    options: zod_1.z.array(zod_1.z.object({ label: zod_1.z.string().min(1), selected: zod_1.z.boolean().optional() })),
});
const productBankOfferSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    bank: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
});
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    slug: zod_1.z
        .string()
        .min(2)
        .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only")
        .optional(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.coerce.number().positive("Price must be positive"),
    mrp: zod_1.z.coerce.number().positive().optional(),
    stock: zod_1.z.coerce.number().int().min(0).default(0),
    images: zod_1.z.array(zod_1.z.string().url("Each image must be a valid URL")).default([]),
    brand: zod_1.z.string().optional(),
    highlights: zod_1.z.array(productHighlightSchema).optional(),
    specGroups: zod_1.z.array(productSpecGroupSchema).optional(),
    overview: zod_1.z.array(productOverviewSchema).optional(),
    variants: zod_1.z.array(productVariantGroupSchema).optional(),
    bankOffers: zod_1.z.array(productBankOfferSchema).optional(),
    relatedProductIds: zod_1.z.array(zod_1.z.string().min(1)).default([]),
    warranty: zod_1.z.string().optional(),
    rating: zod_1.z.coerce.number().min(0).max(5).optional(),
    ratingCount: zod_1.z.coerce.number().int().min(0).default(0),
    reviewCount: zod_1.z.coerce.number().int().min(0).default(0),
    deliveryDate: zod_1.z.string().optional(),
    deliveryFee: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().min(1, "Category is required"),
    isActive: zod_1.z.boolean().default(true),
});
exports.updateProductSchema = exports.createProductSchema.partial();
exports.productQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    search: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
    categoryIds: zod_1.z.string().optional(),
    brand: zod_1.z.string().optional(),
    minPrice: zod_1.z.coerce.number().optional(),
    maxPrice: zod_1.z.coerce.number().optional(),
    stockMin: zod_1.z.coerce.number().int().optional(),
    stockMax: zod_1.z.coerce.number().int().optional(),
    inStock: zod_1.z.coerce.boolean().optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
    sortBy: zod_1.z.enum(["price", "name", "createdAt", "stock"]).default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
//# sourceMappingURL=products.schema.js.map