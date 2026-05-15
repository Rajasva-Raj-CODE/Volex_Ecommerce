import type { Metadata } from "next";
import OrderDetailClient from "@/components/account/orders/OrderDetailClient";

export const metadata: Metadata = {
    title: "Order Details — VolteX",
    description: "View your order details and tracking information.",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;
    return <OrderDetailClient orderId={orderId} />;
}
