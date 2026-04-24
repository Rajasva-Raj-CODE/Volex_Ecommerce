"use client";

import { authedApiRequest } from "./auth-api";

export type CustomerOrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderProduct {
  id: string;
  name: string;
  slug: string;
  images: string[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  productId: string;
  product: OrderProduct;
}

export interface OrderAddress {
  id: string;
  label: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
}

export interface CustomerOrder {
  id: string;
  status: CustomerOrderStatus;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  address: OrderAddress | null;
  items: OrderItem[];
}

export interface CustomerOrdersResponse {
  orders: CustomerOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function getUserOrders(params?: {
  page?: number;
  limit?: number;
  status?: CustomerOrderStatus;
}): Promise<CustomerOrdersResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status) query.set("status", params.status);
  const qs = query.toString();
  return authedApiRequest<CustomerOrdersResponse>(`/orders/my${qs ? `?${qs}` : ""}`);
}

export async function getOrderById(id: string): Promise<CustomerOrder> {
  const result = await authedApiRequest<{ order: CustomerOrder }>(`/orders/${id}`);
  return result.order;
}
