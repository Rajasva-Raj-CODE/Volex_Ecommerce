import { z } from "zod";
export declare const createRazorpayOrderSchema: z.ZodObject<{
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
export declare const verifyRazorpayPaymentSchema: z.ZodObject<{
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
} & {
    razorpayOrderId: z.ZodString;
    razorpayPaymentId: z.ZodString;
    razorpaySignature: z.ZodString;
}, "strip", z.ZodTypeAny, {
    addressId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}, {
    addressId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}>;
export type CreateRazorpayOrderInput = z.infer<typeof createRazorpayOrderSchema>;
export type VerifyRazorpayPaymentInput = z.infer<typeof verifyRazorpayPaymentSchema>;
//# sourceMappingURL=payments.schema.d.ts.map