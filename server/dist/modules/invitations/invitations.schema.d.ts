import { z } from "zod";
export declare const sendInviteSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name?: string | undefined;
}, {
    email: string;
    name?: string | undefined;
}>;
export declare const requestOtpSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const verifyOtpSchema: z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    otp: string;
}, {
    email: string;
    otp: string;
}>;
export type SendInviteInput = z.infer<typeof sendInviteSchema>;
export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
//# sourceMappingURL=invitations.schema.d.ts.map