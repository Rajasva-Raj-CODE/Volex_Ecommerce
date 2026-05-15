import { apiRequest } from "./api";
import type {
  ProductHighlight,
  ProductOverviewSection,
  ProductSpecGroup,
  ProductVariantGroup,
} from "./types";

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  parentId?: string | null;
  sortOrder: number;
  isActive: boolean;
  children?: ApiCategory[];
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: string | number;
  mrp?: string | number | null;
  stock: number;
  images: string[];
  brand?: string | null;
  highlights?: ProductHighlight[] | null;
  specGroups?: ProductSpecGroup[] | null;
  overview?: ProductOverviewSection[] | null;
  variants?: ProductVariantGroup[] | null;
  bankOffers?: { id: string; bank: string; description: string }[] | null;
  relatedProductIds?: string[];
  warranty?: string | null;
  rating?: string | number | null;
  ratingCount?: number;
  reviewCount?: number;
  deliveryDate?: string | null;
  deliveryFee?: string | null;
  isActive: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface ListProductsResponse {
  products: ApiProduct[];
  pagination: PaginationMeta;
}

function buildQuery(params?: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined) return;
    searchParams.set(key, String(value));
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

// GET /api/categories → ApiCategory[] (tree with children)
export async function listCategories() {
  const result = await apiRequest<{ categories: ApiCategory[] }>("/categories", {
    cache: "no-store",
  });
  return result.categories;
}

// GET /api/categories/flat → ApiCategory[] (flat list with parent info)
export async function listCategoriesFlat() {
  const result = await apiRequest<{ categories: ApiCategory[] }>("/categories/flat", {
    cache: "no-store",
  });
  return result.categories;
}

// GET /api/products → { products, pagination }
export async function listProducts(params?: Record<string, string | number | boolean | undefined>) {
  return apiRequest<ListProductsResponse>(`/products${buildQuery(params)}`, {
    cache: "no-store",
  });
}

// GET /api/products/:id → ApiProduct directly
export async function getProduct(idOrSlug: string) {
  const result = await apiRequest<{ product: ApiProduct }>(`/products/${idOrSlug}`, {
    cache: "no-store",
  });
  return result.product;
}
