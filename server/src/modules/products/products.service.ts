import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";
import type { CreateProductInput, UpdateProductInput, ProductQueryInput } from "./products.schema";

// ─── Slug helper ─────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let i = 1;
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${i++}`;
  }
}

// ─── List Products ────────────────────────────────────────────────────────────

export async function listProducts(query: ProductQueryInput) {
  const {
    page, limit, search, categoryId, brand,
    minPrice, maxPrice, inStock, isActive,
    sortBy, sortOrder,
  } = query;

  const where: Prisma.ProductWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (brand) where.brand = { contains: brand, mode: "insensitive" };
  if (isActive !== undefined) where.isActive = isActive;
  if (inStock) where.stock = { gt: 0 };
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
  ]);

  return {
    products,
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

// ─── Get Single Product ───────────────────────────────────────────────────────

export async function getProduct(idOrSlug: string) {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!product) throw new AppError("Product not found", 404);
  return product;
}

// ─── Create Product ───────────────────────────────────────────────────────────

export async function createProduct(input: CreateProductInput) {
  const slug = await uniqueSlug(input.slug ?? toSlug(input.name));

  // Verify category exists
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) throw new AppError("Category not found", 404);

  return prisma.product.create({
    data: {
      ...input,
      slug,
      price: input.price,
      mrp: input.mrp ?? null,
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });
}

// ─── Update Product ───────────────────────────────────────────────────────────

export async function updateProduct(id: string, input: UpdateProductInput) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new AppError("Product not found", 404);

  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) throw new AppError("Category not found", 404);
  }

  let slug = existing.slug;
  if (input.slug && input.slug !== existing.slug) {
    slug = await uniqueSlug(input.slug, id);
  } else if (input.name && input.name !== existing.name && !input.slug) {
    slug = await uniqueSlug(toSlug(input.name), id);
  }

  return prisma.product.update({
    where: { id },
    data: { ...input, slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });
}

// ─── Delete Product ───────────────────────────────────────────────────────────

export async function deleteProduct(id: string) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new AppError("Product not found", 404);
  await prisma.product.delete({ where: { id } });
}
