import { z } from "zod";

export const createAddressSchema = z.object({
  label: z.string().min(1, "Label is required").default("Home"),
  line1: z.string().min(3, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();
