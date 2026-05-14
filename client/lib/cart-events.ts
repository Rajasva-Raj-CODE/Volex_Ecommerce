"use client";

export const CART_UPDATED_EVENT = "voltex:cart-updated";

export function notifyCartUpdated() {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}
