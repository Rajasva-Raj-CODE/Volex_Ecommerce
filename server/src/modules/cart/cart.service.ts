import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";

const CART_PRODUCT_SELECT = {
  id: true,
  name: true,
  slug: true,
  price: true,
  mrp: true,
  images: true,
  stock: true,
  isActive: true,
  brand: true,
  category: { select: { id: true, name: true } },
} as const;

export async function getCart(userId: string) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: { select: CART_PRODUCT_SELECT },
    },
    orderBy: { id: "asc" },
  });

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  return { items, subtotal, itemCount: items.reduce((sum, item) => sum + item.quantity, 0) };
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  const [product, existingItem] = await Promise.all([
    prisma.product.findUnique({ where: { id: productId } }),
    prisma.cartItem.findUnique({ where: { userId_productId: { userId, productId } } }),
  ]);

  if (!product) throw new AppError("Product not found", 404);
  if (!product.isActive) throw new AppError("Product is not available", 400);

  const nextQuantity = (existingItem?.quantity ?? 0) + quantity;
  if (product.stock < nextQuantity) throw new AppError(`Only ${product.stock} units in stock`, 400);

  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId, productId, quantity },
    include: {
      product: { select: CART_PRODUCT_SELECT },
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
      product: { select: CART_PRODUCT_SELECT },
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
