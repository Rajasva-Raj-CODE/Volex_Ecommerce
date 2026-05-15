import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";

export async function getWishlist(userId: string) {
  const items = await prisma.wishlistItem.findMany({
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

export async function addToWishlist(userId: string, productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError("Product not found", 404);

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (existing) throw new AppError("Product already in wishlist", 409);

  return prisma.wishlistItem.create({
    data: { userId, productId },
    include: {
      product: { select: { id: true, name: true, price: true, images: true } },
    },
  });
}

export async function removeFromWishlist(userId: string, productId: string) {
  const item = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (!item) throw new AppError("Product not in wishlist", 404);
  await prisma.wishlistItem.delete({ where: { userId_productId: { userId, productId } } });
}
