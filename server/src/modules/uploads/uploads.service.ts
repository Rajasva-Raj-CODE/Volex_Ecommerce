import https from "node:https";
import path from "node:path";
import { env } from "../../config/env";
import { AppError } from "../../middleware/error.middleware";
import type { UploadImageInput } from "./uploads.schema";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function parseDataUrl(dataUrl: string) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new AppError("Invalid image payload", 400);
  }

  const mimeType = match[1];
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new AppError("Only JPEG, PNG, WebP, and GIF images are supported", 400);
  }

  const buffer = Buffer.from(match[2], "base64");
  if (buffer.byteLength === 0) {
    throw new AppError("Image file is empty", 400);
  }
  if (buffer.byteLength > MAX_IMAGE_BYTES) {
    throw new AppError("Image must be 5MB or smaller", 400);
  }

  return { mimeType, buffer };
}

function sanitizeFileName(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  const baseName = path
    .basename(fileName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${baseName || "image"}-${Date.now()}${ext || ".jpg"}`;
}

function requestSupabaseUpload(
  objectPath: string,
  mimeType: string,
  buffer: Buffer
): Promise<void> {
  return new Promise((resolve, reject) => {
    const baseUrl = new URL(env.SUPABASE_URL);
    const requestPath = `/storage/v1/object/${env.SUPABASE_STORAGE_BUCKET}/${objectPath}`;

    const req = https.request(
      {
        method: "POST",
        hostname: baseUrl.hostname,
        path: requestPath,
        headers: {
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          "Content-Type": mimeType,
          "Content-Length": buffer.byteLength,
          "x-upsert": "true",
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
            return;
          }

          const details = Buffer.concat(chunks).toString("utf8");
          reject(
            new AppError(
              `Supabase upload failed${details ? `: ${details}` : ""}`,
              res.statusCode ?? 500
            )
          );
        });
      }
    );

    req.on("error", reject);
    req.end(buffer);
  });
}

export async function uploadImage(input: UploadImageInput) {
  const { mimeType, buffer } = parseDataUrl(input.dataUrl);
  const fileName = sanitizeFileName(input.fileName);
  const objectPath = `${input.folder}/${fileName}`;

  await requestSupabaseUpload(objectPath, mimeType, buffer);

  const publicUrl = `${env.SUPABASE_URL}/storage/v1/object/public/${env.SUPABASE_STORAGE_BUCKET}/${objectPath}`;
  return {
    url: publicUrl,
    path: objectPath,
    bucket: env.SUPABASE_STORAGE_BUCKET,
  };
}
