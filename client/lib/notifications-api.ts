"use client";

import { authedApiRequest } from "./auth-api";

export type NotificationType =
  | "ORDER_PLACED"
  | "ORDER_CONFIRMED"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED"
  | "ORDER_CANCELLED"
  | "PROMO"
  | "SYSTEM";

export interface ApiNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

interface ListResponse {
  items: ApiNotification[];
  unreadCount: number;
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export function listNotifications(page = 1, limit = 20): Promise<ListResponse> {
  return authedApiRequest<ListResponse>(`/notifications?page=${page}&limit=${limit}`);
}

export function getUnreadCount(): Promise<{ count: number }> {
  return authedApiRequest<{ count: number }>("/notifications/unread-count");
}

export function markAsRead(id: string): Promise<{ notification: ApiNotification }> {
  return authedApiRequest<{ notification: ApiNotification }>(`/notifications/${id}/read`, {
    method: "PUT",
  });
}

export function markAllAsRead(): Promise<{ updated: number }> {
  return authedApiRequest<{ updated: number }>("/notifications/read-all", { method: "PUT" });
}

export function deleteNotification(id: string): Promise<void> {
  return authedApiRequest<void>(`/notifications/${id}`, { method: "DELETE" });
}
