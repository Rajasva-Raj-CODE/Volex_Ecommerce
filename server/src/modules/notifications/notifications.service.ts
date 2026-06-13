import { Prisma, type NotificationType } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";
import { broadcastToUser } from "../../services/realtime.service";

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
}

export async function createNotification(input: CreateNotificationInput) {
  const notification = await prisma.notification.create({ data: input });

  await broadcastToUser({
    userId: input.userId,
    event: "notification",
    payload: { id: notification.id, type: notification.type, createdAt: notification.createdAt },
  });

  return notification;
}

export async function listNotifications(userId: string, query: { page: number; limit: number }) {
  const where: Prisma.NotificationWhereInput = { userId };
  const [total, unreadCount, items] = await Promise.all([
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId, readAt: null } }),
    prisma.notification.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    items,
    unreadCount,
    pagination: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({ where: { userId, readAt: null } });
}

export async function markAsRead(userId: string, notificationId: string) {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });
  if (!notification) throw new AppError("Notification not found", 404);
  if (notification.readAt) return notification;

  return prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  });
}

export async function markAllAsRead(userId: string) {
  const result = await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
  return { updated: result.count };
}

export async function deleteNotification(userId: string, notificationId: string) {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });
  if (!notification) throw new AppError("Notification not found", 404);
  await prisma.notification.delete({ where: { id: notificationId } });
}
