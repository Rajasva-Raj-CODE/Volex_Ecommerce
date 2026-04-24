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
        slug: string;
        description: string | null;
        price: Prisma.Decimal;
        mrp: Prisma.Decimal | null;
        stock: number;
        images: string[];
        brand: string | null;
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
    slug: string;
    description: string | null;
    price: Prisma.Decimal;
    mrp: Prisma.Decimal | null;
    stock: number;
    images: string[];
    brand: string | null;
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
    slug: string;
    description: string | null;
    price: Prisma.Decimal;
    mrp: Prisma.Decimal | null;
    stock: number;
    images: string[];
    brand: string | null;
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
    slug: string;
    description: string | null;
    price: Prisma.Decimal;
    mrp: Prisma.Decimal | null;
    stock: number;
    images: string[];
    brand: string | null;
    categoryId: string;
}>;
export declare function deleteProduct(id: string): Promise<void>;
//# sourceMappingURL=products.service.d.ts.map