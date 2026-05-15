"use client";

import { authedApiRequest } from "./auth-api";

export interface WishlistProduct {
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

export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  product: WishlistProduct;
}

export interface WishlistResponse {
  items: WishlistItem[];
  itemCount: number;
}

export function getWishlist(): Promise<WishlistResponse> {
  return authedApiRequest<WishlistResponse>("/wishlist");
}

export async function addToWishlist(productId: string): Promise<WishlistItem> {
  const result = await authedApiRequest<{ item: WishlistItem }>("/wishlist", {
    method: "POST",
    json: { productId },
  });
  return result.item;
}

export function removeFromWishlist(productId: string): Promise<void> {
  return authedApiRequest<void>(`/wishlist/${productId}`, { method: "DELETE" });
}
