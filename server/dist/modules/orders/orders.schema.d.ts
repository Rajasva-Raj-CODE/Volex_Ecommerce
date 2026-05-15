import { z } from "zod";
export declare const placeOrderSchema: z.ZodObject<{
    addressId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        productId: string;
        quantity: number;
    }, {
        productId: string;
        quantity: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    addressId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
}, {
    addressId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
}>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}, {
    status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}>;
export declare const orderQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]>>;
    userId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | undefined;
    userId?: string | undefined;
}, {
    status?: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | undefined;
    limit?: number | undefined;
    userId?: string | undefined;
    page?: number | undefined;
}>;
export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
//# sourceMappingURL=orders.schema.d.ts.map