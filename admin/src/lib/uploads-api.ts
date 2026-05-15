import { apiRequest } from "./api";

export type UploadFolder = "products" | "categories" | "banners";

export interface UploadedImage {
  url: string;
  path: string;
  bucket: string;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(file: File, folder: UploadFolder): Promise<UploadedImage> {
  const dataUrl = await readFileAsDataUrl(file);
  const result = await apiRequest<{ image: UploadedImage }>("/uploads/image", {
    method: "POST",
    json: {
      fileName: file.name,
      dataUrl,
      folder,
    },
  });

  return result.image;
}
