"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressSchema = exports.createAddressSchema = void 0;
const zod_1 = require("zod");
exports.createAddressSchema = zod_1.z.object({
    label: zod_1.z.string().min(1, "Label is required").default("Home"),
    line1: zod_1.z.string().min(3, "Address line 1 is required"),
    line2: zod_1.z.string().optional(),
    city: zod_1.z.string().min(1, "City is required"),
    state: zod_1.z.string().min(1, "State is required"),
    pincode: zod_1.z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
    isDefault: zod_1.z.boolean().default(false),
});
exports.updateAddressSchema = exports.createAddressSchema.partial();
//# sourceMappingURL=addresses.schema.js.map