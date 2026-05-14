import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";

const RECENT_ORDER_INCLUDE = {
  address: true,
  user: { select: { id: true, name: true, email: true } },
  items: {
    include: {
      product: { select: { id: true, name: true, slug: true, images: true } },
    },
  },
} satisfies Prisma.OrderInclude;

export async function getDashboardSummary() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalRevenue,
    monthlyRevenue,
    totalOrders,
    monthlyOrders,
    totalCustomers,
    totalProducts,
    lowStockItems,
    newProductsThisMonth,
    recentOrders,
  ] = await Promise.all([
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth } },
      _sum: { totalAmount: true },
    }),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
    prisma.product.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: RECENT_ORDER_INCLUDE,
    }),
  ]);

  return {
    totals: {
      revenue: totalRevenue._sum.totalAmount ?? new Prisma.Decimal(0),
      monthlyRevenue: monthlyRevenue._sum.totalAmount ?? new Prisma.Decimal(0),
      orders: totalOrders,
      monthlyOrders,
      customers: totalCustomers,
      products: totalProducts,
      lowStockItems,
      newProductsThisMonth,
    },
    recentOrders,
  };
}
