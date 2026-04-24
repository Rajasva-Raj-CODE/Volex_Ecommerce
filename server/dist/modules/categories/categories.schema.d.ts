import { z } from "zod";
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    parentId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    isActive: boolean;
    sortOrder: number;
    slug?: string | undefined;
    imageUrl?: string | undefined;
    parentId?: string | null | undefined;
}, {
    name: string;
    isActive?: boolean | undefined;
    slug?: string | undefined;
    sortOrder?: number | undefined;
    imageUrl?: string | undefined;
    parentId?: string | null | undefined;
}>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    imageUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    parentId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    slug?: string | undefined;
    sortOrder?: number | undefined;
    imageUrl?: string | undefined;
    parentId?: string | null | undefined;
}, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    slug?: string | undefined;
    sortOrder?: number | undefined;
    imageUrl?: string | undefined;
    parentId?: string | null | undefined;
}>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
//# sourceMappingURL=categories.schema.d.ts.map