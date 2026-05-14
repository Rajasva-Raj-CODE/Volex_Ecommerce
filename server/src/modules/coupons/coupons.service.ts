import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";
import type { CreateCouponInput, UpdateCouponInput, CouponQueryInput } from "./coupons.schema";

// ─── Validate Coupon ─────────────────────────────────────────────────────────

export async function validateCoupon(code: string, orderAmount: number) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon) throw new AppError("Invalid coupon code", 404);
  if (!coupon.isActive) throw new AppError("This coupon is no longer active", 400);
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new AppError("This coupon has expired", 400);
  }
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError("This coupon has reached its usage limit", 400);
  }
  if (coupon.minOrderAmount !== null && orderAmount < Number(coupon.minOrderAmount)) {
    throw new AppError(
      `Minimum order amount of ₹${Number(coupon.minOrderAmount)} is required`,
      400
    );
  }

  let discountAmount: number;

  if (coupon.discountType === "PERCENTAGE") {
    discountAmount = (orderAmount * Number(coupon.discountValue)) / 100;
    if (coupon.maxDiscountAmount !== null) {
      discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
    }
  } else {
    discountAmount = Number(coupon.discountValue);
  }

  // Discount cannot exceed order amount
  discountAmount = Math.min(discountAmount, orderAmount);
  discountAmount = Math.round(discountAmount * 100) / 100;

  return {
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
    },
    discountAmount,
  };
}

// ─── List Coupons (Admin) ────────────────────────────────────────────────────

export async function listCoupons(query: CouponQueryInput) {
  const { page, limit, search, isActive } = query;
  const where: Prisma.CouponWhereInput = {};

  if (search) {
    where.code = { contains: search.toUpperCase(), mode: "insensitive" };
  }
  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const [total, coupons] = await Promise.all([
    prisma.coupon.count({ where }),
    prisma.coupon.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    coupons,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

// ─── Create Coupon ───────────────────────────────────────────────────────────

export async function createCoupon(input: CreateCouponInput) {
  const existing = await prisma.coupon.findUnique({ where: { code: input.code } });
  if (existing) throw new AppError("A coupon with this code already exists", 409);

  const coupon = await prisma.coupon.create({
    data: {
      code: input.code,
      discountType: input.discountType,
      discountValue: input.discountValue,
      minOrderAmount: input.minOrderAmount,
      maxDiscountAmount: input.maxDiscountAmount,
      usageLimit: input.usageLimit,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
      isActive: input.isActive,
    },
  });

  return coupon;
}

// ─── Update Coupon ───────────────────────────────────────────────────────────

export async function updateCoupon(id: string, input: UpdateCouponInput) {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw new AppError("Coupon not found", 404);

  const updated = await prisma.coupon.update({
    where: { id },
    data: {
      ...input,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : input.expiresAt,
    },
  });

  return updated;
}

// ─── Delete Coupon ───────────────────────────────────────────────────────────

export async function deleteCoupon(id: string) {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw new AppError("Coupon not found", 404);

  await prisma.coupon.delete({ where: { id } });
}
