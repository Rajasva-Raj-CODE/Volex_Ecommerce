"use client";

import { authedApiRequest } from "./auth-api";

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  mrp: string | null;
  images: string[];
  stock: number;
  isActive: boolean;
  brand: string | null;
  category: { id: string; name: string } | null;
}

export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  userId: string;
  product: CartProduct;
}

export interface CartResponse {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export function getCart(): Promise<CartResponse> {
  return authedApiRequest<CartResponse>("/cart");
}

export async function addToCart(productId: string, quantity = 1): Promise<CartItem> {
  const result = await authedApiRequest<{ item: CartItem }>("/cart", {
    method: "POST",
    json: { productId, quantity },
  });
  return result.item;
}

export async function updateCartItem(productId: string, quantity: number): Promise<CartItem> {
  const result = await authedApiRequest<{ item: CartItem }>(`/cart/${productId}`, {
    method: "PUT",
    json: { quantity },
  });
  return result.item;
}

export function removeFromCart(productId: string): Promise<void> {
  return authedApiRequest<void>(`/cart/${productId}`, { method: "DELETE" });
}

export function clearCart(): Promise<void> {
  return authedApiRequest<void>("/cart/clear", { method: "DELETE" });
}
