"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.coerce.number().default(8000),
    DATABASE_URL: zod_1.z.string().min(1, "DATABASE_URL is required"),
    JWT_ACCESS_SECRET: zod_1.z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 chars"),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 chars"),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default("7d"),
    RESEND_API_KEY: zod_1.z.string().min(1, "RESEND_API_KEY is required"),
    EMAIL_FROM: zod_1.z.string().default("VolteX <onboarding@resend.dev>"),
    ADMIN_SEED_EMAIL: zod_1.z.string().email().default("admin@voltex.com"),
    ADMIN_SEED_PASSWORD: zod_1.z.string().min(8).default("admin_change_me_123!"),
    ADMIN_SEED_NAME: zod_1.z.string().default("Admin"),
    CLIENT_URL: zod_1.z.string().default("http://localhost:3000"),
    ADMIN_URL: zod_1.z.string().default("http://localhost:3002"),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌  Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map