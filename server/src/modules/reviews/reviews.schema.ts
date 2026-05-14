import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  comment: z.string().min(10).max(2000),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const updateReviewStatusSchema = z.object({
  isApproved: z.boolean(),
});

export type UpdateReviewStatusInput = z.infer<typeof updateReviewStatusSchema>;

export const reviewQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  isApproved: z.coerce.boolean().optional(),
  productId: z.string().optional(),
});

export type ReviewQueryInput = z.infer<typeof reviewQuerySchema>;

export const productReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ProductReviewsQueryInput = z.infer<typeof productReviewsQuerySchema>;
