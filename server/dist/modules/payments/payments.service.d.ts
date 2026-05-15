import { Prisma } from "@prisma/client";
import type { CreateRazorpayOrderInput, VerifyRazorpayPaymentInput } from "./payments.schema";
export declare function createRazorpayOrder(userId: string, input: CreateRazorpayOrderInput): Promise<{
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
}>;
export declare function verifyRazorpayPayment(userId: string, input: VerifyRazorpayPaymentInput): Promise<{
    address: {
        id: string;
        userId: string;
        label: string;
        line1: string;
        line2: string | null;
        city: string;
        state: string;
        pincode: string;
        isDefault: boolean;
    } | null;
    items: ({
        product: {
            name: string;
            id: string;
            slug: string;
            images: string[];
        };
    } & {
        id: string;
        price: Prisma.Decimal;
        productId: string;
        quantity: number;
        orderId: string;
    })[];
} & {
    status: import(".prisma/client").$Enums.OrderStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    addressId: string | null;
    paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
    paymentMethod: string;
    razorpayOrderId: string | null;
    razorpayPaymentId: string | null;
    razorpaySignature: string | null;
    totalAmount: Prisma.Decimal;
}>;
//# sourceMappingURL=payments.service.d.ts.map