"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = getCart;
exports.addToCart = addToCart;
exports.updateCartItem = updateCartItem;
exports.removeFromCart = removeFromCart;
exports.clearCart = clearCart;
const prisma_1 = require("../../config/prisma");
const error_middleware_1 = require("../../middleware/error.middleware");
async function getCart(userId) {
    const items = await prisma_1.prisma.cartItem.findMany({
        where: { userId },
        include: {
            product: {
                select: {
                    id: true, name: true, slug: true, price: true,
                    mrp: true, images: true, stock: true, isActive: true,
                    brand: true, category: { select: { id: true, name: true } },
                },
            },
        },
        orderBy: { id: "asc" },
    });
    const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    return { items, subtotal, itemCount: items.length };
}
async function addToCart(userId, productId, quantity) {
    const product = await prisma_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product)
        throw new error_middleware_1.AppError("Product not found", 404);
    if (!product.isActive)
        throw new error_middleware_1.AppError("Product is not available", 400);
    if (product.stock < quantity)
        throw new error_middleware_1.AppError(`Only ${product.stock} units in stock`, 400);
    const item = await prisma_1.prisma.cartItem.upsert({
        where: { userId_productId: { userId, productId } },
        update: { quantity },
        create: { userId, productId, quantity },
        include: {
            product: { select: { id: true, name: true, price: true, images: true } },
        },
    });
    return item;
}
async function updateCartItem(userId, productId, quantity) {
    const item = await prisma_1.prisma.cartItem.findUnique({
        where: { userId_productId: { userId, productId } },
    });
    if (!item)
        throw new error_middleware_1.AppError("Item not in cart", 404);
    const product = await prisma_1.prisma.product.findUnique({ where: { id: productId } });
    if (product && product.stock < quantity)
        throw new error_middleware_1.AppError(`Only ${product.stock} units in stock`, 400);
    return prisma_1.prisma.cartItem.update({
        where: { userId_productId: { userId, productId } },
        data: { quantity },
        include: {
            product: { select: { id: true, name: true, price: true, images: true } },
        },
    });
}
async function removeFromCart(userId, productId) {
    const item = await prisma_1.prisma.cartItem.findUnique({
        where: { userId_productId: { userId, productId } },
    });
    if (!item)
        throw new error_middleware_1.AppError("Item not in cart", 404);
    await prisma_1.prisma.cartItem.delete({ where: { userId_productId: { userId, productId } } });
}
async function clearCart(userId) {
    await prisma_1.prisma.cartItem.deleteMany({ where: { userId } });
}
//# sourceMappingURL=cart.service.js.map