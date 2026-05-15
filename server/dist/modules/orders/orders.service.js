"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOrder = placeOrder;
exports.getUserOrders = getUserOrders;
exports.getOrder = getOrder;
exports.listAllOrders = listAllOrders;
exports.updateOrderStatus = updateOrderStatus;
const prisma_1 = require("../../config/prisma");
const error_middleware_1 = require("../../middleware/error.middleware");
const ORDER_INCLUDE = {
    address: true,
    items: {
        include: {
            product: { select: { id: true, name: true, slug: true, images: true } },
        },
    },
};
// ─── Place Order ──────────────────────────────────────────────────────────────
async function placeOrder(userId, input, payment) {
    // Verify address belongs to user
    const address = await prisma_1.prisma.address.findFirst({
        where: { id: input.addressId, userId },
    });
    if (!address)
        throw new error_middleware_1.AppError("Address not found", 404);
    // Validate all products and calculate total
    let totalAmount = 0;
    const orderItems = [];
    for (const item of input.items) {
        const product = await prisma_1.prisma.product.findUnique({ where: { id: item.productId } });
        if (!product)
            throw new error_middleware_1.AppError(`Product ${item.productId} not found`, 404);
        if (!product.isActive)
            throw new error_middleware_1.AppError(`${product.name} is not available`, 400);
        if (product.stock < item.quantity)
            throw new error_middleware_1.AppError(`Only ${product.stock} units of "${product.name}" in stock`, 400);
        totalAmount += Number(product.price) * item.quantity;
        orderItems.push({ productId: item.productId, quantity: item.quantity, price: product.price });
    }
    // Create order + items + decrement stock in a transaction
    const order = await prisma_1.prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
            data: {
                userId,
                addressId: input.addressId,
                totalAmount,
                paymentMethod: payment?.paymentMethod ?? "COD",
                paymentStatus: payment?.paymentStatus ?? "PENDING",
                razorpayOrderId: payment?.razorpayOrderId,
                razorpayPaymentId: payment?.razorpayPaymentId,
                razorpaySignature: payment?.razorpaySignature,
                items: { create: orderItems },
            },
            include: ORDER_INCLUDE,
        });
        // Decrement stock atomically. The stock guard prevents overselling if two
        // customers place orders for the same product at the same time.
        await Promise.all(input.items.map(async (item) => {
            const result = await tx.product.updateMany({
                where: {
                    id: item.productId,
                    isActive: true,
                    stock: { gte: item.quantity },
                },
                data: { stock: { decrement: item.quantity } },
            });
            if (result.count !== 1) {
                throw new error_middleware_1.AppError("Product stock changed. Please review your cart.", 409);
            }
        }));
        // Clear cart items that were ordered
        const orderedProductIds = input.items.map((i) => i.productId);
        await tx.cartItem.deleteMany({
            where: { userId, productId: { in: orderedProductIds } },
        });
        return newOrder;
    }, { timeout: 15_000 });
    return order;
}
// ─── Get user's orders ────────────────────────────────────────────────────────
async function getUserOrders(userId, query) {
    const { page, limit, status } = query;
    const where = { userId };
    if (status)
        where.status = status;
    const [total, orders] = await Promise.all([
        prisma_1.prisma.order.count({ where }),
        prisma_1.prisma.order.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: ORDER_INCLUDE,
        }),
    ]);
    return { orders, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}
// ─── Get single order ─────────────────────────────────────────────────────────
async function getOrder(orderId, userId) {
    const where = { id: orderId };
    if (userId)
        where.userId = userId; // customers can only see their own
    const order = await prisma_1.prisma.order.findFirst({ where, include: ORDER_INCLUDE });
    if (!order)
        throw new error_middleware_1.AppError("Order not found", 404);
    return order;
}
// ─── Admin: list all orders ───────────────────────────────────────────────────
async function listAllOrders(query) {
    const { page, limit, status, userId } = query;
    const where = {};
    if (status)
        where.status = status;
    if (userId)
        where.userId = userId;
    const [total, orders] = await Promise.all([
        prisma_1.prisma.order.count({ where }),
        prisma_1.prisma.order.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                ...ORDER_INCLUDE,
                user: { select: { id: true, name: true, email: true } },
            },
        }),
    ]);
    return { orders, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}
// ─── Admin: update order status ───────────────────────────────────────────────
async function updateOrderStatus(orderId, input) {
    const order = await prisma_1.prisma.order.findUnique({ where: { id: orderId } });
    if (!order)
        throw new error_middleware_1.AppError("Order not found", 404);
    if (order.status === "DELIVERED" || order.status === "CANCELLED") {
        throw new error_middleware_1.AppError(`Cannot update a ${order.status.toLowerCase()} order`, 400);
    }
    return prisma_1.prisma.order.update({
        where: { id: orderId },
        data: { status: input.status },
        include: ORDER_INCLUDE,
    });
}
//# sourceMappingURL=orders.service.js.map