import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";

export async function getCart(userId: string) {
  const items = await prisma.cartItem.findMany({
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

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  return { items, subtotal, itemCount: items.length };
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError("Product not found", 404);
  if (!product.isActive) throw new AppError("Product is not available", 400);
  if (product.stock < quantity) throw new AppError(`Only ${product.stock} units in stock`, 400);

  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity },
    create: { userId, productId, quantity },
    include: {
      product: { select: { id: true, name: true, price: true, images: true } },
    },
  });

  return item;
}

export async function updateCartItem(userId: string, productId: string, quantity: number) {
  const item = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (!item) throw new AppError("Item not in cart", 404);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (product && product.stock < quantity)
    throw new AppError(`Only ${product.stock} units in stock`, 400);

  return prisma.cartItem.update({
    where: { userId_productId: { userId, productId } },
    data: { quantity },
    include: {
      product: { select: { id: true, name: true, price: true, images: true } },
    },
  });
}

export async function removeFromCart(userId: string, productId: string) {
  const item = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (!item) throw new AppError("Item not in cart", 404);
  await prisma.cartItem.delete({ where: { userId_productId: { userId, productId } } });
}

export async function clearCart(userId: string) {
  await prisma.cartItem.deleteMany({ where: { userId } });
}
