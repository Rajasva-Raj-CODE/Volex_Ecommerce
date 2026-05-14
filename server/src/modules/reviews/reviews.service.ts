import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";
import type {
  CreateReviewInput,
  ReviewQueryInput,
  ProductReviewsQueryInput,
} from "./reviews.schema";

// ─── Create Review ──────────────────────────────────────────────────────────

export async function createReview(
  userId: string,
  productId: string,
  input: CreateReviewInput
) {
  // Check product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Check if user already reviewed this product
  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    throw new AppError("You have already reviewed this product", 409);
  }

  const review = await prisma.review.create({
    data: {
      rating: input.rating,
      title: input.title,
      comment: input.comment,
      userId,
      productId,
    },
  });

  return review;
}

// ─── Get Product Reviews (Public) ───────────────────────────────────────────

export async function getProductReviews(
  productId: string,
  query: ProductReviewsQueryInput
) {
  const { page, limit } = query;

  const where: Prisma.ReviewWhereInput = {
    productId,
    isApproved: true,
  };

  const [total, reviews, aggregate] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    }),
    prisma.review.aggregate({
      where,
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ]);

  return {
    reviews,
    avgRating: aggregate._avg.rating ?? 0,
    totalReviews: aggregate._count.rating,
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

// ─── List All Reviews (Admin) ───────────────────────────────────────────────

export async function listAllReviews(query: ReviewQueryInput) {
  const { page, limit, isApproved, productId } = query;

  const where: Prisma.ReviewWhereInput = {};

  if (isApproved !== undefined) {
    where.isApproved = isApproved;
  }

  if (productId) {
    where.productId = productId;
  }

  const [total, reviews] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        product: {
          select: { id: true, name: true, slug: true, images: true },
        },
      },
    }),
  ]);

  return {
    reviews,
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

// ─── Update Review Status (Admin) ───────────────────────────────────────────

export async function updateReviewStatus(reviewId: string, isApproved: boolean) {
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { isApproved },
  });

  // Recalculate product rating based on approved reviews
  const agg = await prisma.review.aggregate({
    where: { productId: review.productId, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: review.productId },
    data: {
      rating: agg._avg.rating ?? 0,
      ratingCount: agg._count.rating,
      reviewCount: agg._count.rating,
    },
  });

  return review;
}

// ─── Delete Review (Admin) ──────────────────────────────────────────────────

export async function deleteReview(reviewId: string) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true, productId: true },
  });

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  await prisma.review.delete({ where: { id: reviewId } });

  // Recalculate product rating based on remaining approved reviews
  const agg = await prisma.review.aggregate({
    where: { productId: review.productId, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: review.productId },
    data: {
      rating: agg._avg.rating ?? 0,
      ratingCount: agg._count.rating,
      reviewCount: agg._count.rating,
    },
  });
}
