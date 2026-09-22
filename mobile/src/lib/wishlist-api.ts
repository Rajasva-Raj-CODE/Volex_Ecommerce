import { apiRequest } from "./api";
import type { CartProduct } from "./cart-api";

export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  product: CartProduct;
}

export interface Wishlist {
  items: WishlistItem[];
  itemCount: number;
}

/** GET /api/wishlist */
export function fetchWishlist(signal?: AbortSignal) {
  return apiRequest<Wishlist>("/wishlist", { auth: true, signal });
}

/** POST /api/wishlist — 409 if the product is already there. */
export async function addWishlistItem(productId: string) {
  const result = await apiRequest<{ item: WishlistItem }>("/wishlist", {
    method: "POST",
    auth: true,
    json: { productId },
  });
  return result.item;
}

/** DELETE /api/wishlist/:productId */
export function removeWishlistItem(productId: string) {
  return apiRequest<null>(`/wishlist/${productId}`, { method: "DELETE", auth: true });
}
