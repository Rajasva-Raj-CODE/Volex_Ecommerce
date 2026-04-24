import type { AdminLoginInput, CustomerRegisterInput, CustomerLoginInput } from "./auth.schema";
export declare function adminLogin(input: AdminLoginInput): Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare function refreshTokens(rawRefreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare function logout(rawRefreshToken: string): Promise<void>;
export declare function getMe(userId: string): Promise<{
    email: string;
    name: string | null;
    id: string;
    role: import(".prisma/client").$Enums.Role;
    createdAt: Date;
}>;
export declare function customerRegister(input: CustomerRegisterInput): Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare function customerLogin(input: CustomerLoginInput): Promise<{
    accessToken: string;
    refreshToken: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map