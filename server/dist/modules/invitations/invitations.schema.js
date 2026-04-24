"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpSchema = exports.requestOtpSchema = exports.sendInviteSchema = void 0;
const zod_1 = require("zod");
exports.sendInviteSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    name: zod_1.z.string().min(1, "Name is required").optional(),
});
exports.requestOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
});
exports.verifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    otp: zod_1.z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must be numeric"),
});
//# sourceMappingURL=invitations.schema.js.map