import { apiRequest } from "./api";

export interface ProductHighlight {
  text: string;
}

export interface ProductSpecGroup {
  groupName: string;
  specs: { label: string; value: string }[];
}

export interface ProductOverviewSection {
  heading: string;
  description: string;
}

export interface ProductVariantGroup {
  name: string;
  options: { label: string; selected?: boolean }[];
}

export interface ProductBankOffer {
  id: string;
  bank: string;
  description: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  mrp: string | null;
  stock: number;
  images: string[];
  brand: string | null;
  highlights: ProductHighlight[] | null;
  specGroups: ProductSpecGroup[] | null;
  overview: ProductOverviewSection[] | null;
  variants: ProductVariantGroup[] | null;
  bankOffers: ProductBankOffer[] | null;
  relatedProductIds: string[];
  warranty: string | null;
  rating: string | null;
  ratingCount: number;
  reviewCount: number;
  deliveryDate: string | null;
  deliveryFee: string | null;
  isActive: boolean;
  categoryId: string;
  category: { id: string; name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsListResponse {
  products: ApiProduct[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  mrp?: number;
  stock: number;
  images: string[];
  brand?: string;
  highlights?: ProductHighlight[];
  specGroups?: ProductSpecGroup[];
  overview?: ProductOverviewSection[];
  variants?: ProductVariantGroup[];
  bankOffers?: ProductBankOffer[];
  relatedProductIds?: string[];
  warranty?: string;
  rating?: number;
  ratingCount?: number;
  reviewCount?: number;
  deliveryDate?: string;
  deliveryFee?: string;
  categoryId: string;
  isActive?: boolean;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  stockMin?: number;
  stockMax?: number;
  inStock?: boolean;
  isActive?: boolean;
  sortBy?: "price" | "name" | "createdAt" | "stock";
  sortOrder?: "asc" | "desc";
}

export function listProducts(query: ProductQuery = {}) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined) params.set(k, String(v));
  }
  const qs = params.toString();
  return apiRequest<ProductsListResponse>(`/products${qs ? `?${qs}` : ""}`);
}

export async function getProduct(idOrSlug: string) {
  const data = await apiRequest<{ product: ApiProduct }>(`/products/${idOrSlug}`);
  return data.product;
}

export async function createProduct(input: CreateProductInput) {
  const data = await apiRequest<{ product: ApiProduct }>("/products", { method: "POST", json: input });
  return data.product;
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const data = await apiRequest<{ product: ApiProduct }>(`/products/${id}`, { method: "PUT", json: input });
  return data.product;
}

export function deleteProduct(id: string) {
  return apiRequest<null>(`/products/${id}`, { method: "DELETE" });
}
