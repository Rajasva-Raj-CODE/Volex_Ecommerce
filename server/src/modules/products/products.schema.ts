import { z } from "zod";

const productHighlightSchema = z.object({ text: z.string().min(1) });
const productSpecGroupSchema = z.object({
  groupName: z.string().min(1),
  specs: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })),
});
const productOverviewSchema = z.object({
  heading: z.string().min(1),
  description: z.string().min(1),
});
const productVariantGroupSchema = z.object({
  name: z.string().min(1),
  options: z.array(z.object({ label: z.string().min(1), selected: z.boolean().optional() })),
});
const productBankOfferSchema = z.object({
  id: z.string().min(1),
  bank: z.string().min(1),
  description: z.string().min(1),
});

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only")
    .optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  mrp: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  images: z.array(z.string().url("Each image must be a valid URL")).default([]),
  brand: z.string().optional(),
  highlights: z.array(productHighlightSchema).optional(),
  specGroups: z.array(productSpecGroupSchema).optional(),
  overview: z.array(productOverviewSchema).optional(),
  variants: z.array(productVariantGroupSchema).optional(),
  bankOffers: z.array(productBankOfferSchema).optional(),
  relatedProductIds: z.array(z.string().min(1)).default([]),
  warranty: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  ratingCount: z.coerce.number().int().min(0).default(0),
  reviewCount: z.coerce.number().int().min(0).default(0),
  deliveryDate: z.string().optional(),
  deliveryFee: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  categoryIds: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  stockMin: z.coerce.number().int().optional(),
  stockMax: z.coerce.number().int().optional(),
  inStock: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(["price", "name", "createdAt", "stock"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
