import { Prisma } from "@prisma/client";
import type { CreateProductInput, UpdateProductInput, ProductQueryInput } from "./products.schema";
export declare function listProducts(query: ProductQueryInput): Promise<{
    products: ({
        category: {
            name: string;
            id: string;
            slug: string;
        };
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        price: Prisma.Decimal;
        mrp: Prisma.Decimal | null;
        stock: number;
        images: string[];
        brand: string | null;
        highlights: Prisma.JsonValue | null;
        specGroups: Prisma.JsonValue | null;
        overview: Prisma.JsonValue | null;
        variants: Prisma.JsonValue | null;
        bankOffers: Prisma.JsonValue | null;
        relatedProductIds: string[];
        warranty: string | null;
        rating: Prisma.Decimal | null;
        ratingCount: number;
        reviewCount: number;
        deliveryDate: string | null;
        deliveryFee: string | null;
        categoryId: string;
    })[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}>;
export declare function getProduct(idOrSlug: string): Promise<{
    category: {
        name: string;
        id: string;
        slug: string;
    };
} & {
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    slug: string;
    price: Prisma.Decimal;
    mrp: Prisma.Decimal | null;
    stock: number;
    images: string[];
    brand: string | null;
    highlights: Prisma.JsonValue | null;
    specGroups: Prisma.JsonValue | null;
    overview: Prisma.JsonValue | null;
    variants: Prisma.JsonValue | null;
    bankOffers: Prisma.JsonValue | null;
    relatedProductIds: string[];
    warranty: string | null;
    rating: Prisma.Decimal | null;
    ratingCount: number;
    reviewCount: number;
    deliveryDate: string | null;
    deliveryFee: string | null;
    categoryId: string;
}>;
export declare function createProduct(input: CreateProductInput): Promise<{
    category: {
        name: string;
        id: string;
        slug: string;
    };
} & {
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    slug: string;
    price: Prisma.Decimal;
    mrp: Prisma.Decimal | null;
    stock: number;
    images: string[];
    brand: string | null;
    highlights: Prisma.JsonValue | null;
    specGroups: Prisma.JsonValue | null;
    overview: Prisma.JsonValue | null;
    variants: Prisma.JsonValue | null;
    bankOffers: Prisma.JsonValue | null;
    relatedProductIds: string[];
    warranty: string | null;
    rating: Prisma.Decimal | null;
    ratingCount: number;
    reviewCount: number;
    deliveryDate: string | null;
    deliveryFee: string | null;
    categoryId: string;
}>;
export declare function updateProduct(id: string, input: UpdateProductInput): Promise<{
    category: {
        name: string;
        id: string;
        slug: string;
    };
} & {
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    slug: string;
    price: Prisma.Decimal;
    mrp: Prisma.Decimal | null;
    stock: number;
    images: string[];
    brand: string | null;
    highlights: Prisma.JsonValue | null;
    specGroups: Prisma.JsonValue | null;
    overview: Prisma.JsonValue | null;
    variants: Prisma.JsonValue | null;
    bankOffers: Prisma.JsonValue | null;
    relatedProductIds: string[];
    warranty: string | null;
    rating: Prisma.Decimal | null;
    ratingCount: number;
    reviewCount: number;
    deliveryDate: string | null;
    deliveryFee: string | null;
    categoryId: string;
}>;
export declare function deleteProduct(id: string): Promise<void>;
//# sourceMappingURL=products.service.d.ts.map