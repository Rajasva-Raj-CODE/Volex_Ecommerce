import { z } from "zod";
export declare const uploadImageSchema: z.ZodObject<{
    fileName: z.ZodString;
    dataUrl: z.ZodString;
    folder: z.ZodDefault<z.ZodEnum<["products", "categories", "banners"]>>;
}, "strip", z.ZodTypeAny, {
    fileName: string;
    dataUrl: string;
    folder: "products" | "categories" | "banners";
}, {
    fileName: string;
    dataUrl: string;
    folder?: "products" | "categories" | "banners" | undefined;
}>;
export type UploadImageInput = z.infer<typeof uploadImageSchema>;
//# sourceMappingURL=uploads.schema.d.ts.map