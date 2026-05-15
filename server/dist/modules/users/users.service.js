"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCustomers = listCustomers;
const prisma_1 = require("../../config/prisma");
async function listCustomers(query) {
    const { page, limit, search, isActive } = query;
    const where = {
        role: "CUSTOMER",
    };
    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
        ];
    }
    if (isActive !== undefined) {
        where.isActive = isActive;
    }
    const [total, users] = await Promise.all([
        prisma_1.prisma.user.count({ where }),
        prisma_1.prisma.user.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                createdAt: true,
                orders: {
                    select: {
                        totalAmount: true,
                    },
                },
            },
        }),
    ]);
    const customers = users.map((user) => {
        const totalSpend = user.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            createdAt: user.createdAt,
            ordersCount: user.orders.length,
            totalSpend,
        };
    });
    return {
        users: customers,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
        },
    };
}
//# sourceMappingURL=users.service.js.map