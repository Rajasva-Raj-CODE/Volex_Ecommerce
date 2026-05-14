import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";
import type { UsersQueryInput, UpdateProfileInput, ChangePasswordInput } from "./users.schema";

export async function listCustomers(query: UsersQueryInput) {
  const { page, limit, search, isActive } = query;

  const where: Prisma.UserWhereInput = {
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
    prisma.user.count({ where }),
    prisma.user.findMany({
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
    const totalSpend = user.orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    );

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

// ─── Profile Update ──────────────────────────────────────────────────────────

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.avatar !== undefined && { avatar: input.avatar }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatar: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

// ─── Change Password ─────────────────────────────────────────────────────────

export async function changePassword(userId: string, input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, passwordHash: true },
  });

  if (!user || !user.passwordHash) {
    throw new AppError("Password change is not available for this account", 400);
  }

  const passwordOk = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!passwordOk) {
    throw new AppError("Current password is incorrect", 401);
  }

  const newHash = await bcrypt.hash(input.newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });
}
