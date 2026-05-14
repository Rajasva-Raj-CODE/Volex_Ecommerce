"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRazorpayOrder = createRazorpayOrder;
exports.verifyRazorpayPayment = verifyRazorpayPayment;
const node_crypto_1 = __importDefault(require("node:crypto"));
const node_https_1 = __importDefault(require("node:https"));
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const env_1 = require("../../config/env");
const error_middleware_1 = require("../../middleware/error.middleware");
const orders_service_1 = require("../orders/orders.service");
async function calculateOrderTotal(userId, input) {
    const address = await prisma_1.prisma.address.findFirst({
        where: { id: input.addressId, userId },
    });
    if (!address)
        throw new error_middleware_1.AppError("Address not found", 404);
    let totalAmount = 0;
    for (const item of input.items) {
        const product = await prisma_1.prisma.product.findUnique({ where: { id: item.productId } });
        if (!product)
            throw new error_middleware_1.AppError(`Product ${item.productId} not found`, 404);
        if (!product.isActive)
            throw new error_middleware_1.AppError(`${product.name} is not available`, 400);
        if (product.stock < item.quantity) {
            throw new error_middleware_1.AppError(`Only ${product.stock} units of "${product.name}" in stock`, 400);
        }
        totalAmount += Number(product.price) * item.quantity;
    }
    return new client_1.Prisma.Decimal(totalAmount);
}
function razorpayRequest(path, body) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(body);
        const auth = Buffer.from(`${env_1.env.RAZORPAY_KEY_ID}:${env_1.env.RAZORPAY_KEY_SECRET}`).toString("base64");
        const req = node_https_1.default.request({
            method: "POST",
            hostname: "api.razorpay.com",
            path,
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(payload),
            },
        }, (res) => {
            const chunks = [];
            res.on("data", (chunk) => chunks.push(chunk));
            res.on("end", () => {
                const raw = Buffer.concat(chunks).toString("utf8");
                const parsed = raw ? JSON.parse(raw) : undefined;
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300 && parsed) {
                    resolve(parsed);
                    return;
                }
                reject(new error_middleware_1.AppError(parsed?.error?.description ?? "Razorpay request failed", res.statusCode ?? 500));
            });
        });
        req.on("error", reject);
        req.end(payload);
    });
}
async function createRazorpayOrder(userId, input) {
    const totalAmount = await calculateOrderTotal(userId, input);
    const amountInPaise = totalAmount.mul(100).toNumber();
    const razorpayOrder = await razorpayRequest("/v1/orders", {
        amount: amountInPaise,
        currency: "INR",
        receipt: `voltex_${Date.now()}`,
        notes: {
            userId,
        },
    });
    return {
        keyId: env_1.env.RAZORPAY_KEY_ID,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
    };
}
async function verifyRazorpayPayment(userId, input) {
    const existingOrder = await prisma_1.prisma.order.findUnique({
        where: { razorpayPaymentId: input.razorpayPaymentId },
    });
    if (existingOrder) {
        throw new error_middleware_1.AppError("This payment has already been used for an order", 409);
    }
    const expectedSignature = node_crypto_1.default
        .createHmac("sha256", env_1.env.RAZORPAY_KEY_SECRET)
        .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
        .digest("hex");
    if (expectedSignature !== input.razorpaySignature) {
        throw new error_middleware_1.AppError("Payment verification failed", 400);
    }
    return (0, orders_service_1.placeOrder)(userId, {
        addressId: input.addressId,
        items: input.items,
    }, {
        paymentMethod: "RAZORPAY",
        paymentStatus: "PAID",
        razorpayOrderId: input.razorpayOrderId,
        razorpayPaymentId: input.razorpayPaymentId,
        razorpaySignature: input.razorpaySignature,
    });
}
//# sourceMappingURL=payments.service.js.map