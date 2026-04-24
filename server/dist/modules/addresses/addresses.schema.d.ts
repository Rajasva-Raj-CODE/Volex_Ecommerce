import { z } from "zod";
export declare const createAddressSchema: z.ZodObject<{
    label: z.ZodDefault<z.ZodString>;
    line1: z.ZodString;
    line2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    state: z.ZodString;
    pincode: z.ZodString;
    isDefault: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    label: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
    line2?: string | undefined;
}, {
    line1: string;
    city: string;
    state: string;
    pincode: string;
    label?: string | undefined;
    line2?: string | undefined;
    isDefault?: boolean | undefined;
}>;
export declare const updateAddressSchema: z.ZodObject<{
    label: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    line1: z.ZodOptional<z.ZodString>;
    line2: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    pincode: z.ZodOptional<z.ZodString>;
    isDefault: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    label?: string | undefined;
    line1?: string | undefined;
    line2?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    pincode?: string | undefined;
    isDefault?: boolean | undefined;
}, {
    label?: string | undefined;
    line1?: string | undefined;
    line2?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    pincode?: string | undefined;
    isDefault?: boolean | undefined;
}>;
//# sourceMappingURL=addresses.schema.d.ts.map