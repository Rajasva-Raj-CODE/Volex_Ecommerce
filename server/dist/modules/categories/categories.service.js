"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = listCategories;
exports.listCategoriesFlat = listCategoriesFlat;
exports.getCategory = getCategory;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const prisma_1 = require("../../config/prisma");
const error_middleware_1 = require("../../middleware/error.middleware");
function toSlug(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}
async function uniqueSlug(base, excludeId) {
    let slug = base;
    let i = 1;
    while (true) {
        const existing = await prisma_1.prisma.category.findUnique({ where: { slug } });
        if (!existing || existing.id === excludeId)
            return slug;
        slug = `${base}-${i++}`;
    }
}
// ─── Get all categories (tree structure) ─────────────────────────────────────
async function listCategories() {
    // Fetch top-level categories with their children
    return prisma_1.prisma.category.findMany({
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
async function listCategoriesFlat() {
    return prisma_1.prisma.category.findMany({
        orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }],
        include: {
            parent: { select: { id: true, name: true } },
        },
    });
}
// ─── Get single category ──────────────────────────────────────────────────────
async function getCategory(idOrSlug) {
    const category = await prisma_1.prisma.category.findFirst({
        where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
        include: {
            children: { orderBy: { sortOrder: "asc" } },
            parent: { select: { id: true, name: true, slug: true } },
        },
    });
    if (!category)
        throw new error_middleware_1.AppError("Category not found", 404);
    return category;
}
// ─── Create category ──────────────────────────────────────────────────────────
async function createCategory(input) {
    const slug = await uniqueSlug(input.slug ?? toSlug(input.name));
    if (input.parentId) {
        const parent = await prisma_1.prisma.category.findUnique({ where: { id: input.parentId } });
        if (!parent)
            throw new error_middleware_1.AppError("Parent category not found", 404);
    }
    return prisma_1.prisma.category.create({
        data: { ...input, slug },
        include: {
            parent: { select: { id: true, name: true } },
        },
    });
}
// ─── Update category ──────────────────────────────────────────────────────────
async function updateCategory(id, input) {
    const existing = await prisma_1.prisma.category.findUnique({ where: { id } });
    if (!existing)
        throw new error_middleware_1.AppError("Category not found", 404);
    // Prevent setting itself as parent
    if (input.parentId === id)
        throw new error_middleware_1.AppError("Category cannot be its own parent", 400);
    let slug = existing.slug;
    if (input.slug && input.slug !== existing.slug) {
        slug = await uniqueSlug(input.slug, id);
    }
    else if (input.name && input.name !== existing.name && !input.slug) {
        slug = await uniqueSlug(toSlug(input.name), id);
    }
    return prisma_1.prisma.category.update({
        where: { id },
        data: { ...input, slug },
        include: { parent: { select: { id: true, name: true } } },
    });
}
// ─── Delete category ──────────────────────────────────────────────────────────
async function deleteCategory(id) {
    const existing = await prisma_1.prisma.category.findUnique({
        where: { id },
        include: { _count: { select: { products: true, children: true } } },
    });
    if (!existing)
        throw new error_middleware_1.AppError("Category not found", 404);
    if (existing._count.products > 0)
        throw new error_middleware_1.AppError(`Cannot delete — ${existing._count.products} products use this category`, 400);
    if (existing._count.children > 0)
        throw new error_middleware_1.AppError(`Cannot delete — has ${existing._count.children} subcategories`, 400);
    await prisma_1.prisma.category.delete({ where: { id } });
}
//# sourceMappingURL=categories.service.js.map