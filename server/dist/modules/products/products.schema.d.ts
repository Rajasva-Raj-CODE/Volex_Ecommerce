import { z } from "zod";
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    mrp: z.ZodOptional<z.ZodNumber>;
    stock: z.ZodDefault<z.ZodNumber>;
    images: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    brand: z.ZodOptional<z.ZodString>;
    highlights: z.ZodOptional<z.ZodArray<z.ZodObject<{
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
    }, {
        text: string;
    }>, "many">>;
    specGroups: z.ZodOptional<z.ZodArray<z.ZodObject<{
        groupName: z.ZodString;
        specs: z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        groupName: string;
        specs: {
            value: string;
            label: string;
        }[];
    }, {
        groupName: string;
        specs: {
            value: string;
            label: string;
        }[];
    }>, "many">>;
    overview: z.ZodOptional<z.ZodArray<z.ZodObject<{
        heading: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        heading: string;
        description: string;
    }, {
        heading: string;
        description: string;
    }>, "many">>;
    variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        options: z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            selected: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            label: string;
            selected?: boolean | undefined;
        }, {
            label: string;
            selected?: boolean | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        options: {
            label: string;
            selected?: boolean | undefined;
        }[];
        name: string;
    }, {
        options: {
            label: string;
            selected?: boolean | undefined;
        }[];
        name: string;
    }>, "many">>;
    bankOffers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        bank: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        description: string;
        bank: string;
    }, {
        id: string;
        description: string;
        bank: string;
    }>, "many">>;
    relatedProductIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    warranty: z.ZodOptional<z.ZodString>;
    rating: z.ZodOptional<z.ZodNumber>;
    ratingCount: z.ZodDefault<z.ZodNumber>;
    reviewCount: z.ZodDefault<z.ZodNumber>;
    deliveryDate: z.ZodOptional<z.ZodString>;
    deliveryFee: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodString;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    isActive: boolean;
    price: number;
    stock: number;
    images: string[];
    relatedProductIds: string[];
    ratingCount: number;
    reviewCount: number;
    categoryId: string;
    description?: string | undefined;
    slug?: string | undefined;
    mrp?: number | undefined;
    brand?: string | undefined;
    highlights?: {
        text: string;
    }[] | undefined;
    specGroups?: {
        groupName: string;
        specs: {
            value: string;
            label: string;
        }[];
    }[] | undefined;
    overview?: {
        heading: string;
        description: string;
    }[] | undefined;
    variants?: {
        options: {
            label: string;
            selected?: boolean | undefined;
        }[];
        name: string;
    }[] | undefined;
    bankOffers?: {
        id: string;
        description: string;
        bank: string;
    }[] | undefined;
    warranty?: string | undefined;
    rating?: number | undefined;
    deliveryDate?: string | undefined;
    deliveryFee?: string | undefined;
}, {
    name: string;
    price: number;
    categoryId: string;
    isActive?: boolean | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    mrp?: number | undefined;
    stock?: number | undefined;
    images?: string[] | undefined;
    brand?: string | undefined;
    highlights?: {
        text: string;
    }[] | undefined;
    specGroups?: {
        groupName: string;
        specs: {
            value: string;
            label: string;
        }[];
    }[] | undefined;
    overview?: {
        heading: string;
        description: string;
    }[] | undefined;
    variants?: {
        options: {
            label: string;
            selected?: boolean | undefined;
        }[];
        name: string;
    }[] | undefined;
    bankOffers?: {
        id: string;
        description: string;
        bank: string;
    }[] | undefined;
    relatedProductIds?: string[] | undefined;
    warranty?: string | undefined;
    rating?: number | undefined;
    ratingCount?: number | undefined;
    reviewCount?: number | undefined;
    deliveryDate?: string | undefined;
    deliveryFee?: string | undefined;
}>;
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    price: z.ZodOptional<z.ZodNumber>;
    mrp: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    stock: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    images: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    brand: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    highlights: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
    }, {
        text: string;
    }>, "many">>>;
    specGroups: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        groupName: z.ZodString;
        specs: z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        groupName: string;
        specs: {
            value: string;
            label: string;
        }[];
    }, {
        groupName: string;
        specs: {
            value: string;
            label: string;
        }[];
    }>, "many">>>;
    overview: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        heading: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        heading: string;
        description: string;
    }, {
        heading: string;
        description: string;
    }>, "many">>>;
    variants: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        options: z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            selected: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            label: string;
            selected?: boolean | undefined;
        }, {
            label: string;
            selected?: boolean | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        options: {
            label: string;
            selected?: boolean | undefined;
        }[];
        name: string;
    }, {
        options: {
            label: string;
            selected?: boolean | undefined;
        }[];
        name: string;
    }>, "many">>>;
    bankOffers: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        bank: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        description: string;
        bank: string;
    }, {
        id: string;
        description: string;
        bank: string;
    }>, "many">>>;
    relatedProductIds: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    warranty: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    rating: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    ratingCount: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    reviewCount: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    deliveryDate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    deliveryFee: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    categoryId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    price?: number | undefined;
    mrp?: number | undefined;
    stock?: number | undefined;
    images?: string[] | undefined;
    brand?: string | undefined;
    highlights?: {
        text: string;
    }[] | undefined;
    specGroups?: {
        groupName: string;
        specs: {
            value: string;
            label: string;
        }[];
    }[] | undefined;
    overview?: {
        heading: string;
        description: string;
    }[] | undefined;
    variants?: {
        options: {
            label: string;
            selected?: boolean | undefined;
        }[];
        name: string;
    }[] | undefined;
    bankOffers?: {
        id: string;
        description: string;
        bank: string;
    }[] | undefined;
    relatedProductIds?: string[] | undefined;
    warranty?: string | undefined;
    rating?: number | undefined;
    ratingCount?: number | undefined;
    reviewCount?: number | undefined;
    deliveryDate?: string | undefined;
    deliveryFee?: string | undefined;
    categoryId?: string | undefined;
}, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    price?: number | undefined;
    mrp?: number | undefined;
    stock?: number | undefined;
    images?: string[] | undefined;
    brand?: string | undefined;
    highlights?: {
        text: string;
    }[] | undefined;
    specGroups?: {
        groupName: string;
        specs: {
            value: string;
            label: string;
        }[];
    }[] | undefined;
    overview?: {
        heading: string;
        description: string;
    }[] | undefined;
    variants?: {
        options: {
            label: string;
            selected?: boolean | undefined;
        }[];
        name: string;
    }[] | undefined;
    bankOffers?: {
        id: string;
        description: string;
        bank: string;
    }[] | undefined;
    relatedProductIds?: string[] | undefined;
    warranty?: string | undefined;
    rating?: number | undefined;
    ratingCount?: number | undefined;
    reviewCount?: number | undefined;
    deliveryDate?: string | undefined;
    deliveryFee?: string | undefined;
    categoryId?: string | undefined;
}>;
export declare const productQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    categoryIds: z.ZodOptional<z.ZodString>;
    brand: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    stockMin: z.ZodOptional<z.ZodNumber>;
    stockMax: z.ZodOptional<z.ZodNumber>;
    inStock: z.ZodOptional<z.ZodBoolean>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    sortBy: z.ZodDefault<z.ZodEnum<["price", "name", "createdAt", "stock"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sortBy: "name" | "createdAt" | "price" | "stock";
    sortOrder: "asc" | "desc";
    search?: string | undefined;
    isActive?: boolean | undefined;
    brand?: string | undefined;
    categoryId?: string | undefined;
    categoryIds?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    stockMin?: number | undefined;
    stockMax?: number | undefined;
    inStock?: boolean | undefined;
}, {
    limit?: number | undefined;
    search?: string | undefined;
    isActive?: boolean | undefined;
    brand?: string | undefined;
    categoryId?: string | undefined;
    page?: number | undefined;
    categoryIds?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    stockMin?: number | undefined;
    stockMax?: number | undefined;
    inStock?: boolean | undefined;
    sortBy?: "name" | "createdAt" | "price" | "stock" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
//# sourceMappingURL=products.schema.d.ts.map