import { apiRequest } from "./api";

export interface ApiCustomer {
  id: string;
  name: string | null;
  email: string;
  isActive: boolean;
  createdAt: string;
  ordersCount: number;
  totalSpend: number;
}

export interface CustomersListResponse {
  users: ApiCustomer[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CustomersQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export function listCustomers(query: CustomersQuery = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }

  const qs = params.toString();
  return apiRequest<CustomersListResponse>(`/users${qs ? `?${qs}` : ""}`);
}
