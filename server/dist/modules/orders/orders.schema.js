"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQuerySchema = exports.updateOrderStatusSchema = exports.placeOrderSchema = void 0;
const zod_1 = require("zod");
exports.placeOrderSchema = zod_1.z.object({
    addressId: zod_1.z.string().min(1, "Delivery address is required"),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string().min(1),
        quantity: zod_1.z.coerce.number().int().min(1),
    }))
        .min(1, "Order must have at least one item"),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});
exports.orderQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    status: zod_1.z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
    userId: zod_1.z.string().optional(),
});
//# sourceMappingURL=orders.schema.js.map