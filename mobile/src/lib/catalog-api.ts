import { apiRequest } from "./api";

/** Shapes returned by the server. Kept aligned with client/lib/catalog-api.ts. */

export interface ProductHighlight {
  text: string;
}

export interface ProductSpecGroup {
  groupName: string;
  specs: { label: string; value: string }[];
}

export interface ProductVariantGroup {
  name: string;
  options: { label: string; selected?: boolean }[];
}

export interface ProductOverviewSection {
  heading: string;
  description: string;
}

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
  category?: { id: string; name: string; slug: string };
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

export type ProductQuery = Record<string, string | number | boolean | undefined>;

function buildQuery(params?: ProductQuery) {
  const search = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

/** GET /api/categories → tree with children */
export async function listCategories(signal?: AbortSignal) {
  const result = await apiRequest<{ categories: ApiCategory[] }>("/categories", { signal });
  return result.categories;
}

/** GET /api/categories/:idOrSlug — accepts a slug, includes children + parent */
export interface ApiCategoryDetail extends ApiCategory {
  children?: ApiCategory[];
  parent?: { id: string; name: string; slug: string } | null;
}

export async function getCategory(idOrSlug: string, signal?: AbortSignal) {
  const result = await apiRequest<{ category: ApiCategoryDetail }>(
    `/categories/${idOrSlug}`,
    { signal }
  );
  return result.category;
}

/** GET /api/products → { products, pagination } */
export function listProducts(params?: ProductQuery, signal?: AbortSignal) {
  return apiRequest<ListProductsResponse>(`/products${buildQuery(params)}`, { signal });
}

/** GET /api/products/:idOrSlug */
export async function getProduct(idOrSlug: string, signal?: AbortSignal) {
  const result = await apiRequest<{ product: ApiProduct }>(`/products/${idOrSlug}`, { signal });
  return result.product;
}

/** GET /api/reviews/products/:productId → approved reviews + aggregate */
export interface ApiReview {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: { id: string; name?: string | null; avatar?: string | null } | null;
}

export interface ProductReviewsResponse {
  reviews: ApiReview[];
  avgRating: number;
  totalReviews: number;
  pagination: PaginationMeta;
}

export function listProductReviews(productId: string, signal?: AbortSignal) {
  return apiRequest<ProductReviewsResponse>(`/reviews/products/${productId}`, { signal });
}
