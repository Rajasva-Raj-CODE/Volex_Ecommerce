import type { Metadata } from "next";
import NotificationsClient from "@/components/account/notifications/NotificationsClient";

export const metadata: Metadata = {
    title: "Notifications — VolteX",
    description: "Stay updated with the latest alerts, offers and order updates.",
};

export default function NotificationsPage() {
    return <NotificationsClient />;
}
