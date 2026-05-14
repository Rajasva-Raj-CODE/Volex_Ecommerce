import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";
import type { CreateCategoryInput, UpdateCategoryInput } from "./categories.schema";

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
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${i++}`;
  }
}

// ─── Get all categories (tree structure) ─────────────────────────────────────

export async function listCategories() {
  // Fetch top-level categories with their children
  return prisma.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    include: {
      children: {
        orderBy: { sortOrder: "asc" },
        include: {
          children: { orderBy: { sortOrder: "asc" } }, // 3 levels deep
        },
      },
    },
  });
}

// ─── Get flat list (for dropdowns) ───────────────────────────────────────────

export async function listCategoriesFlat() {
  return prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }],
    include: {
      parent: { select: { id: true, name: true } },
    },
  });
}

export async function listCategoriesPaginated(query: { page: number; limit: number; search?: string }) {
  const where = query.search
    ? {
        OR: [
          { name: { contains: query.search, mode: "insensitive" as const } },
          { slug: { contains: query.search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [total, categories] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }],
      include: {
        parent: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    categories,
    pagination: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
      hasNext: query.page * query.limit < total,
      hasPrev: query.page > 1,
    },
  };
}

// ─── Get single category ──────────────────────────────────────────────────────

export async function getCategory(idOrSlug: string) {
  const category = await prisma.category.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: {
      children: { orderBy: { sortOrder: "asc" } },
      parent: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!category) throw new AppError("Category not found", 404);
  return category;
}

// ─── Create category ──────────────────────────────────────────────────────────

export async function createCategory(input: CreateCategoryInput) {
  const slug = await uniqueSlug(input.slug ?? toSlug(input.name));

  if (input.parentId) {
    const parent = await prisma.category.findUnique({ where: { id: input.parentId } });
    if (!parent) throw new AppError("Parent category not found", 404);
  }

  return prisma.category.create({
    data: { ...input, slug },
    include: {
      parent: { select: { id: true, name: true } },
    },
  });
}

// ─── Update category ──────────────────────────────────────────────────────────

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new AppError("Category not found", 404);

  // Prevent setting itself as parent
  if (input.parentId === id) throw new AppError("Category cannot be its own parent", 400);

  let slug = existing.slug;
  if (input.slug && input.slug !== existing.slug) {
    slug = await uniqueSlug(input.slug, id);
  } else if (input.name && input.name !== existing.name && !input.slug) {
    slug = await uniqueSlug(toSlug(input.name), id);
  }

  return prisma.category.update({
    where: { id },
    data: { ...input, slug },
    include: { parent: { select: { id: true, name: true } } },
  });
}

// ─── Delete category ──────────────────────────────────────────────────────────

export async function deleteCategory(id: string) {
  const existing = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true, children: true } } },
  });
  if (!existing) throw new AppError("Category not found", 404);
  if (existing._count.products > 0)
    throw new AppError(`Cannot delete — ${existing._count.products} products use this category`, 400);
  if (existing._count.children > 0)
    throw new AppError(`Cannot delete — has ${existing._count.children} subcategories`, 400);
  await prisma.category.delete({ where: { id } });
}
