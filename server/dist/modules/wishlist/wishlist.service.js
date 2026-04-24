"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWishlist = getWishlist;
exports.addToWishlist = addToWishlist;
exports.removeFromWishlist = removeFromWishlist;
const prisma_1 = require("../../config/prisma");
const error_middleware_1 = require("../../middleware/error.middleware");
async function getWishlist(userId) {
    const items = await prisma_1.prisma.wishlistItem.findMany({
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
    return { items, itemCount: items.length };
}
async function addToWishlist(userId, productId) {
    const product = await prisma_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product)
        throw new error_middleware_1.AppError("Product not found", 404);
    const existing = await prisma_1.prisma.wishlistItem.findUnique({
        where: { userId_productId: { userId, productId } },
    });
    if (existing)
        throw new error_middleware_1.AppError("Product already in wishlist", 409);
    return prisma_1.prisma.wishlistItem.create({
        data: { userId, productId },
        include: {
            product: { select: { id: true, name: true, price: true, images: true } },
        },
    });
}
async function removeFromWishlist(userId, productId) {
    const item = await prisma_1.prisma.wishlistItem.findUnique({
        where: { userId_productId: { userId, productId } },
    });
    if (!item)
        throw new error_middleware_1.AppError("Product not in wishlist", 404);
    await prisma_1.prisma.wishlistItem.delete({ where: { userId_productId: { userId, productId } } });
}
//# sourceMappingURL=wishlist.service.js.map