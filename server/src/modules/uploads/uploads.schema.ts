import { z } from "zod";

export const uploadImageSchema = z.object({
  fileName: z.string().min(1).max(180),
  dataUrl: z.string().min(1),
  folder: z
    .enum(["products", "categories", "banners"])
    .default("products"),
});

export type UploadImageInput = z.infer<typeof uploadImageSchema>;
