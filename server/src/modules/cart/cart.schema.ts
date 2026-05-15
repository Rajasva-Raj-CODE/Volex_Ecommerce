import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1").max(99).default(1),
});

export const updateCartSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(99),
});
