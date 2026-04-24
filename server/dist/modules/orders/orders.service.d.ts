import { Prisma } from "@prisma/client";
import type { PlaceOrderInput, UpdateOrderStatusInput, OrderQueryInput } from "./orders.schema";
export declare function placeOrder(userId: string, input: PlaceOrderInput): Promise<{
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
    totalAmount: Prisma.Decimal;
}>;
export declare function getUserOrders(userId: string, query: OrderQueryInput): Promise<{
    orders: ({
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
        totalAmount: Prisma.Decimal;
    })[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
export declare function getOrder(orderId: string, userId?: string): Promise<{
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
    totalAmount: Prisma.Decimal;
}>;
export declare function listAllOrders(query: OrderQueryInput): Promise<{
    orders: ({
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
        totalAmount: Prisma.Decimal;
    })[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
export declare function updateOrderStatus(orderId: string, input: UpdateOrderStatusInput): Promise<{
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
    totalAmount: Prisma.Decimal;
}>;
//# sourceMappingURL=orders.service.d.ts.map