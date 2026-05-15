"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ShoppingCart01Icon,
    PackageIcon,
    DeliveryTruck01Icon,
    Tick02Icon,
    Cancel01Icon,
    Clock01Icon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "@/contexts/AuthContext";
import { getUserOrders, type CustomerOrder, type CustomerOrderStatus } from "@/lib/orders-api";
import { ApiError } from "@/lib/api";

const STATUS_CONFIG: Record<CustomerOrderStatus, { label: string; color: string; icon: typeof Tick02Icon }> = {
    PENDING:    { label: "Pending",       color: "text-amber-400",   icon: Clock01Icon },
    CONFIRMED:  { label: "Confirmed",     color: "text-blue-400",    icon: PackageIcon },
    SHIPPED:    { label: "Shipped",       color: "text-[#49A5A2]",   icon: DeliveryTruck01Icon },
    DELIVERED:  { label: "Delivered",     color: "text-emerald-400", icon: Tick02Icon },
    CANCELLED:  { label: "Cancelled",     color: "text-red-400",     icon: Cancel01Icon },
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function OrdersClient() {
    const { isLoggedIn, isReady } = useAuth();
    const [orders, setOrders] = useState<CustomerOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = useCallback(async () => {
        if (!isLoggedIn) { setLoading(false); return; }
        setLoading(true);
        setError("");
        try {
            const data = await getUserOrders({ limit: 50 });
            setOrders(data.orders);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isReady) void fetchOrders();
    }, [isReady, fetchOrders]);

    if (!isReady || loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-white text-[22px] font-bold tracking-tight">My Orders</h1>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-5 animate-pulse">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-lg bg-white/[0.04]" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-white/[0.06] rounded w-3/5" />
                                    <div className="h-3 bg-white/[0.04] rounded w-2/5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <h1 className="text-white text-[22px] font-bold tracking-tight">My Orders</h1>
                <p className="text-red-400 text-sm">{error}</p>
                <button onClick={fetchOrders} className="text-[#49A5A2] text-sm hover:underline">Try again</button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="space-y-6">
                <h1 className="text-white text-[22px] font-bold tracking-tight">My Orders</h1>
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center">
                        <HugeiconsIcon icon={ShoppingCart01Icon} size={28} className="text-white/20" />
                    </div>
                    <p className="text-white/40 text-[14px]">No orders yet</p>
                    <Link href="/" className="text-[#49A5A2] text-[13px] hover:underline">Start shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-white text-[22px] font-bold tracking-tight">My Orders</h1>

            <div className="space-y-4">
                {orders.map((order) => {
                    const cfg = STATUS_CONFIG[order.status];
                    const firstItem = order.items[0];
                    const image = firstItem?.product.images[0];
                    const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

                    return (
                        <Link
                            href={`/orders/${order.id}`}
                            key={order.id}
                            className="block rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-5 hover:border-white/[0.14] transition-all duration-200 cursor-pointer group"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-14 h-14 rounded-lg border border-white/[0.08] bg-white/[0.04] flex items-center justify-center shrink-0 overflow-hidden">
                                        {image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={image} alt={firstItem.product.name} className="object-contain w-full h-full p-1" />
                                        ) : (
                                            <HugeiconsIcon icon={ShoppingCart01Icon} size={22} className="text-white/25" />
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-white text-[14px] font-semibold leading-snug group-hover:text-[#49A5A2] transition-colors">
                                            {firstItem ? firstItem.product.name : "Order"}
                                            {order.items.length > 1 && (
                                                <span className="text-white/40 font-normal"> +{order.items.length - 1} more</span>
                                            )}
                                        </p>
                                        <p className="text-white/40 text-[12px] mt-1">
                                            Order #{order.id.slice(0, 8)} · {formatDate(order.createdAt)} · {itemCount} {itemCount === 1 ? "item" : "items"}
                                        </p>
                                        <div className={`flex items-center gap-1.5 mt-2 ${cfg.color}`}>
                                            <HugeiconsIcon icon={cfg.icon} size={13} />
                                            <span className="text-[12px] font-medium">{cfg.label}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <p className="text-white text-[15px] font-bold">
                                        ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
