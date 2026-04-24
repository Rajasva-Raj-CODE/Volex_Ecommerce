import { apiRequest } from "./api";

export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface ApiOrderItem {
  id: string;
  quantity: number;
  price: string;
  product: { id: string; name: string; slug: string; images: string[] };
}

export interface ApiOrder {
  id: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string | null; email: string };
  address: {
    id: string;
    label: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
  };
  items: ApiOrderItem[];
}

export interface OrdersListResponse {
  orders: ApiOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface OrderQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  userId?: string;
}

export function listAllOrders(query: OrderQuery = {}) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined) params.set(k, String(v));
  }
  const qs = params.toString();
  return apiRequest<OrdersListResponse>(`/orders${qs ? `?${qs}` : ""}`);
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  return apiRequest<ApiOrder>(`/orders/${id}/status`, { method: "PUT", json: { status } });
}
