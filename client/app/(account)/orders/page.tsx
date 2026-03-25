import type { Metadata } from "next";
import OrdersClient from "@/components/account/orders/OrdersClient";

export const metadata: Metadata = {
    title: "My Orders — VolteX",
    description: "View, track, cancel orders and buy again.",
};

export default function OrdersPage() {
    return <OrdersClient />;
}
