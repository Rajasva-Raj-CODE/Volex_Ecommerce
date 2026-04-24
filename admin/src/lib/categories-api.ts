import { apiRequest } from "./api";

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  parent?: { id: string; name: string } | null;
  children?: ApiCategory[];
  _count?: { products: number };
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  imageUrl?: string;
  parentId?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export async function listCategoriesTree() {
  const data = await apiRequest<{ categories: ApiCategory[] }>("/categories");
  return data.categories;
}

export async function listCategoriesFlat() {
  const data = await apiRequest<{ categories: ApiCategory[] }>("/categories/flat");
  return data.categories;
}

export async function createCategory(input: CreateCategoryInput) {
  const data = await apiRequest<{ category: ApiCategory }>("/categories", { method: "POST", json: input });
  return data.category;
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const data = await apiRequest<{ category: ApiCategory }>(`/categories/${id}`, { method: "PUT", json: input });
  return data.category;
}

export function deleteCategory(id: string) {
  return apiRequest<null>(`/categories/${id}`, { method: "DELETE" });
}
