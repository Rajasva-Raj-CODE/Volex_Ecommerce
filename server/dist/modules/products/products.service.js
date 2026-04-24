"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = listProducts;
exports.getProduct = getProduct;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const prisma_1 = require("../../config/prisma");
const error_middleware_1 = require("../../middleware/error.middleware");
// ─── Slug helper ─────────────────────────────────────────────────────────────
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
        const existing = await prisma_1.prisma.product.findUnique({ where: { slug } });
        if (!existing || existing.id === excludeId)
            return slug;
        slug = `${base}-${i++}`;
    }
}
// ─── List Products ────────────────────────────────────────────────────────────
async function listProducts(query) {
    const { page, limit, search, categoryId, brand, minPrice, maxPrice, inStock, isActive, sortBy, sortOrder, } = query;
    const where = {};
    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { brand: { contains: search, mode: "insensitive" } },
        ];
    }
    if (categoryId)
        where.categoryId = categoryId;
    if (brand)
        where.brand = { contains: brand, mode: "insensitive" };
    if (isActive !== undefined)
        where.isActive = isActive;
    if (inStock)
        where.stock = { gt: 0 };
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined)
            where.price.gte = minPrice;
        if (maxPrice !== undefined)
            where.price.lte = maxPrice;
    }
    const [total, products] = await Promise.all([
        prisma_1.prisma.product.count({ where }),
        prisma_1.prisma.product.findMany({
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
async function getProduct(idOrSlug) {
    const product = await prisma_1.prisma.product.findFirst({
        where: {
            OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        },
        include: {
            category: { select: { id: true, name: true, slug: true } },
        },
    });
    if (!product)
        throw new error_middleware_1.AppError("Product not found", 404);
    return product;
}
// ─── Create Product ───────────────────────────────────────────────────────────
async function createProduct(input) {
    const slug = await uniqueSlug(input.slug ?? toSlug(input.name));
    // Verify category exists
    const category = await prisma_1.prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category)
        throw new error_middleware_1.AppError("Category not found", 404);
    return prisma_1.prisma.product.create({
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
async function updateProduct(id, input) {
    const existing = await prisma_1.prisma.product.findUnique({ where: { id } });
    if (!existing)
        throw new error_middleware_1.AppError("Product not found", 404);
    if (input.categoryId) {
        const category = await prisma_1.prisma.category.findUnique({ where: { id: input.categoryId } });
        if (!category)
            throw new error_middleware_1.AppError("Category not found", 404);
    }
    let slug = existing.slug;
    if (input.slug && input.slug !== existing.slug) {
        slug = await uniqueSlug(input.slug, id);
    }
    else if (input.name && input.name !== existing.name && !input.slug) {
        slug = await uniqueSlug(toSlug(input.name), id);
    }
    return prisma_1.prisma.product.update({
        where: { id },
        data: { ...input, slug },
        include: {
            category: { select: { id: true, name: true, slug: true } },
        },
    });
}
// ─── Delete Product ───────────────────────────────────────────────────────────
async function deleteProduct(id) {
    const existing = await prisma_1.prisma.product.findUnique({ where: { id } });
    if (!existing)
        throw new error_middleware_1.AppError("Product not found", 404);
    await prisma_1.prisma.product.delete({ where: { id } });
}
//# sourceMappingURL=products.service.js.map