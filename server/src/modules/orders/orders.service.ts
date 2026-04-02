import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";
import type { PlaceOrderInput, UpdateOrderStatusInput, OrderQueryInput } from "./orders.schema";

const ORDER_INCLUDE = {
  address: true,
  items: {
    include: {
      product: { select: { id: true, name: true, slug: true, images: true } },
    },
  },
} satisfies Prisma.OrderInclude;

// ─── Place Order ──────────────────────────────────────────────────────────────

export async function placeOrder(userId: string, input: PlaceOrderInput) {
  // Verify address belongs to user
  const address = await prisma.address.findFirst({
    where: { id: input.addressId, userId },
  });
  if (!address) throw new AppError("Address not found", 404);

  // Validate all products and calculate total
  let totalAmount = 0;
  const orderItems: { productId: string; quantity: number; price: Prisma.Decimal }[] = [];

  for (const item of input.items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) throw new AppError(`Product ${item.productId} not found`, 404);
    if (!product.isActive) throw new AppError(`${product.name} is not available`, 400);
    if (product.stock < item.quantity)
      throw new AppError(`Only ${product.stock} units of "${product.name}" in stock`, 400);

    totalAmount += Number(product.price) * item.quantity;
    orderItems.push({ productId: item.productId, quantity: item.quantity, price: product.price });
  }

  // Create order + items + decrement stock in a transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        addressId: input.addressId,
        totalAmount,
        items: { create: orderItems },
      },
      include: ORDER_INCLUDE,
    });

    // Decrement stock for each product
    for (const item of input.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Clear cart items that were ordered
    const orderedProductIds = input.items.map((i) => i.productId);
    await tx.cartItem.deleteMany({
      where: { userId, productId: { in: orderedProductIds } },
    });

    return newOrder;
  });

  return order;
}

// ─── Get user's orders ────────────────────────────────────────────────────────

export async function getUserOrders(userId: string, query: OrderQueryInput) {
  const { page, limit, status } = query;
  const where: Prisma.OrderWhereInput = { userId };
  if (status) where.status = status;

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
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

export async function getOrder(orderId: string, userId?: string) {
  const where: Prisma.OrderWhereInput = { id: orderId };
  if (userId) where.userId = userId; // customers can only see their own

  const order = await prisma.order.findFirst({ where, include: ORDER_INCLUDE });
  if (!order) throw new AppError("Order not found", 404);
  return order;
}

// ─── Admin: list all orders ───────────────────────────────────────────────────

export async function listAllOrders(query: OrderQueryInput) {
  const { page, limit, status, userId } = query;
  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status;
  if (userId) where.userId = userId;

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
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

export async function updateOrderStatus(orderId: string, input: UpdateOrderStatusInput) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError("Order not found", 404);

  if (order.status === "DELIVERED" || order.status === "CANCELLED") {
    throw new AppError(`Cannot update a ${order.status.toLowerCase()} order`, 400);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: input.status },
    include: ORDER_INCLUDE,
  });
}
