"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummary = getDashboardSummary;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const RECENT_ORDER_INCLUDE = {
    address: true,
    user: { select: { id: true, name: true, email: true } },
    items: {
        include: {
            product: { select: { id: true, name: true, slug: true, images: true } },
        },
    },
};
async function getDashboardSummary() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const [totalRevenue, monthlyRevenue, totalOrders, monthlyOrders, totalCustomers, totalProducts, lowStockItems, newProductsThisMonth, recentOrders,] = await Promise.all([
        prisma_1.prisma.order.aggregate({ _sum: { totalAmount: true } }),
        prisma_1.prisma.order.aggregate({
            where: { createdAt: { gte: startOfMonth } },
            _sum: { totalAmount: true },
        }),
        prisma_1.prisma.order.count(),
        prisma_1.prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
        prisma_1.prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma_1.prisma.product.count(),
        prisma_1.prisma.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
        prisma_1.prisma.product.count({ where: { createdAt: { gte: startOfMonth } } }),
        prisma_1.prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: RECENT_ORDER_INCLUDE,
        }),
    ]);
    return {
        totals: {
            revenue: totalRevenue._sum.totalAmount ?? new client_1.Prisma.Decimal(0),
            monthlyRevenue: monthlyRevenue._sum.totalAmount ?? new client_1.Prisma.Decimal(0),
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
//# sourceMappingURL=dashboard.service.js.map