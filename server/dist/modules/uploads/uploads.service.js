"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = uploadImage;
const node_https_1 = __importDefault(require("node:https"));
const node_path_1 = __importDefault(require("node:path"));
const env_1 = require("../../config/env");
const error_middleware_1 = require("../../middleware/error.middleware");
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);
function parseDataUrl(dataUrl) {
    const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
    if (!match) {
        throw new error_middleware_1.AppError("Invalid image payload", 400);
    }
    const mimeType = match[1];
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        throw new error_middleware_1.AppError("Only JPEG, PNG, WebP, and GIF images are supported", 400);
    }
    const buffer = Buffer.from(match[2], "base64");
    if (buffer.byteLength === 0) {
        throw new error_middleware_1.AppError("Image file is empty", 400);
    }
    if (buffer.byteLength > MAX_IMAGE_BYTES) {
        throw new error_middleware_1.AppError("Image must be 5MB or smaller", 400);
    }
    return { mimeType, buffer };
}
function sanitizeFileName(fileName) {
    const ext = node_path_1.default.extname(fileName).toLowerCase();
    const baseName = node_path_1.default
        .basename(fileName, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
    return `${baseName || "image"}-${Date.now()}${ext || ".jpg"}`;
}
function requestSupabaseUpload(objectPath, mimeType, buffer) {
    return new Promise((resolve, reject) => {
        const baseUrl = new URL(env_1.env.SUPABASE_URL);
        const requestPath = `/storage/v1/object/${env_1.env.SUPABASE_STORAGE_BUCKET}/${objectPath}`;
        const req = node_https_1.default.request({
            method: "POST",
            hostname: baseUrl.hostname,
            path: requestPath,
            headers: {
                Authorization: `Bearer ${env_1.env.SUPABASE_SERVICE_ROLE_KEY}`,
                apikey: env_1.env.SUPABASE_SERVICE_ROLE_KEY,
                "Content-Type": mimeType,
                "Content-Length": buffer.byteLength,
                "x-upsert": "true",
            },
        }, (res) => {
            const chunks = [];
            res.on("data", (chunk) => chunks.push(chunk));
            res.on("end", () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    resolve();
                    return;
                }
                const details = Buffer.concat(chunks).toString("utf8");
                reject(new error_middleware_1.AppError(`Supabase upload failed${details ? `: ${details}` : ""}`, res.statusCode ?? 500));
            });
        });
        req.on("error", reject);
        req.end(buffer);
    });
}
async function uploadImage(input) {
    const { mimeType, buffer } = parseDataUrl(input.dataUrl);
    const fileName = sanitizeFileName(input.fileName);
    const objectPath = `${input.folder}/${fileName}`;
    await requestSupabaseUpload(objectPath, mimeType, buffer);
    const publicUrl = `${env_1.env.SUPABASE_URL}/storage/v1/object/public/${env_1.env.SUPABASE_STORAGE_BUCKET}/${objectPath}`;
    return {
        url: publicUrl,
        path: objectPath,
        bucket: env_1.env.SUPABASE_STORAGE_BUCKET,
    };
}
//# sourceMappingURL=uploads.service.js.map