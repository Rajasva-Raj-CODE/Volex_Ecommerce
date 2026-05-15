"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRazorpayPaymentSchema = exports.createRazorpayOrderSchema = void 0;
const zod_1 = require("zod");
const orders_schema_1 = require("../orders/orders.schema");
exports.createRazorpayOrderSchema = orders_schema_1.placeOrderSchema;
exports.verifyRazorpayPaymentSchema = orders_schema_1.placeOrderSchema.extend({
    razorpayOrderId: zod_1.z.string().min(1),
    razorpayPaymentId: zod_1.z.string().min(1),
    razorpaySignature: zod_1.z.string().min(1),
});
//# sourceMappingURL=payments.schema.js.map