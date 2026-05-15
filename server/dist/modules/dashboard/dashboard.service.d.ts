import { Prisma } from "@prisma/client";
export declare function getDashboardSummary(): Promise<{
    totals: {
        revenue: Prisma.Decimal;
        monthlyRevenue: Prisma.Decimal;
        orders: number;
        monthlyOrders: number;
        customers: number;
        products: number;
        lowStockItems: number;
        newProductsThisMonth: number;
    };
    recentOrders: ({
        user: {
            email: string;
            name: string | null;
            id: string;
        };
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
    })[];
}>;
//# sourceMappingURL=dashboard.service.d.ts.map