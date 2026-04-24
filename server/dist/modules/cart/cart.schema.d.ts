import { z } from "zod";
export declare const addToCartSchema: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    productId: string;
    quantity: number;
}, {
    productId: string;
    quantity?: number | undefined;
}>;
export declare const updateCartSchema: z.ZodObject<{
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    quantity: number;
}, {
    quantity: number;
}>;
//# sourceMappingURL=cart.schema.d.ts.map