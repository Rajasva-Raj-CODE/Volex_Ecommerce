"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartSchema = exports.addToCartSchema = void 0;
const zod_1 = require("zod");
exports.addToCartSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, "Product ID is required"),
    quantity: zod_1.z.coerce.number().int().min(1, "Quantity must be at least 1").max(99).default(1),
});
exports.updateCartSchema = zod_1.z.object({
    quantity: zod_1.z.coerce.number().int().min(1).max(99),
});
//# sourceMappingURL=cart.schema.js.map