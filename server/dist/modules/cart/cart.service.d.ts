export declare function getCart(userId: string): Promise<{
    items: ({
        product: {
            name: string;
            category: {
                name: string;
                id: string;
            };
            id: string;
            isActive: boolean;
            slug: string;
            price: import("@prisma/client/runtime/library").Decimal;
            mrp: import("@prisma/client/runtime/library").Decimal | null;
            stock: number;
            images: string[];
            brand: string | null;
        };
    } & {
        id: string;
        userId: string;
        productId: string;
        quantity: number;
    })[];
    subtotal: number;
    itemCount: number;
}>;
export declare function addToCart(userId: string, productId: string, quantity: number): Promise<{
    product: {
        name: string;
        id: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
    };
} & {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
}>;
export declare function updateCartItem(userId: string, productId: string, quantity: number): Promise<{
    product: {
        name: string;
        id: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
    };
} & {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
}>;
export declare function removeFromCart(userId: string, productId: string): Promise<void>;
export declare function clearCart(userId: string): Promise<void>;
//# sourceMappingURL=cart.service.d.ts.map