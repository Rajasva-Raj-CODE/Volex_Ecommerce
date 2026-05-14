import { apiRequest } from "./api";
import type { ApiOrder } from "./orders-api";

export interface DashboardSummary {
  totals: {
    revenue: string;
    monthlyRevenue: string;
    orders: number;
    monthlyOrders: number;
    customers: number;
    products: number;
    lowStockItems: number;
    newProductsThisMonth: number;
  };
  recentOrders: ApiOrder[];
}

export function getDashboardSummary() {
  return apiRequest<DashboardSummary>("/dashboard/summary");
}
