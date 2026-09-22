import { apiRequest } from "./api";

/** The trimmed product shape the cart endpoints return. */
export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  mrp?: string | number | null;
  images: string[];
  stock: number;
  isActive: boolean;
  brand?: string | null;
  category?: { id: string; name: string } | null;
}

export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  userId: string;
  product: CartProduct;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

/** GET /api/cart */
export function fetchCart(signal?: AbortSignal) {
  return apiRequest<Cart>("/cart", { auth: true, signal });
}

/** POST /api/cart — upserts by productId, so calling twice increments. */
export async function addCartItem(productId: string, quantity = 1) {
  const result = await apiRequest<{ item: CartItem }>("/cart", {
    method: "POST",
    auth: true,
    json: { productId, quantity },
  });
  return result.item;
}

/** PUT /api/cart/:productId — sets an absolute quantity (1-99). */
export async function updateCartItem(productId: string, quantity: number) {
  const result = await apiRequest<{ item: CartItem }>(`/cart/${productId}`, {
    method: "PUT",
    auth: true,
    json: { quantity },
  });
  return result.item;
}

/** DELETE /api/cart/:productId */
export function removeCartItem(productId: string) {
  return apiRequest<null>(`/cart/${productId}`, { method: "DELETE", auth: true });
}

/** DELETE /api/cart/clear */
export function clearCart() {
  return apiRequest<null>("/cart/clear", { method: "DELETE", auth: true });
}
