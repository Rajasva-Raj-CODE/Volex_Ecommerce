import { z } from "zod";
export declare const usersQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    search?: string | undefined;
    isActive?: boolean | undefined;
}, {
    limit?: number | undefined;
    search?: string | undefined;
    isActive?: boolean | undefined;
    page?: number | undefined;
}>;
export type UsersQueryInput = z.infer<typeof usersQuerySchema>;
//# sourceMappingURL=users.schema.d.ts.map