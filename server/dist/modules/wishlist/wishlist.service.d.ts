export declare function getWishlist(userId: string): Promise<{
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
    })[];
    itemCount: number;
}>;
export declare function addToWishlist(userId: string, productId: string): Promise<{
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
}>;
export declare function removeFromWishlist(userId: string, productId: string): Promise<void>;
//# sourceMappingURL=wishlist.service.d.ts.map