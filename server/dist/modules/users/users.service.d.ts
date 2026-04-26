import type { UsersQueryInput } from "./users.schema";
export declare function listCustomers(query: UsersQueryInput): Promise<{
    users: {
        id: string;
        name: string | null;
        email: string;
        isActive: boolean;
        createdAt: Date;
        ordersCount: number;
        totalSpend: number;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}>;
//# sourceMappingURL=users.service.d.ts.map