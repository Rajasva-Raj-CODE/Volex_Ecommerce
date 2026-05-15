"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ArrowLeft02Icon,
    ShoppingCart01Icon,
    Clock01Icon,
    PackageIcon,
    DeliveryTruck01Icon,
    Tick02Icon,
    Cancel01Icon,
    Location01Icon,
    CreditCardIcon,
    RepeatIcon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "@/contexts/AuthContext";
import { getOrderById, type CustomerOrder, type CustomerOrderStatus } from "@/lib/orders-api";
import { addToCart } from "@/lib/cart-api";
import { notifyCartUpdated } from "@/lib/cart-events";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";

const STATUS_CONFIG: Record<CustomerOrderStatus, { label: string; color: string; bgColor: string; icon: typeof Tick02Icon }> = {
    PENDING:   { label: "Pending",   color: "text-amber-400",   bgColor: "bg-amber-400/10",   icon: Clock01Icon },
    CONFIRMED: { label: "Confirmed", color: "text-blue-400",    bgColor: "bg-blue-400/10",    icon: PackageIcon },
    SHIPPED:   { label: "Shipped",   color: "text-[#49A5A2]",   bgColor: "bg-[#49A5A2]/10",   icon: DeliveryTruck01Icon },
    DELIVERED: { label: "Delivered", color: "text-emerald-400", bgColor: "bg-emerald-400/10", icon: Tick02Icon },
    CANCELLED: { label: "Cancelled", color: "text-red-400",     bgColor: "bg-red-400/10",     icon: Cancel01Icon },
};

const STATUS_STEPS: CustomerOrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function OrderDetailClient({ orderId }: { orderId: string }) {
    const router = useRouter();
    const { isLoggedIn, isReady } = useAuth();
    const [order, setOrder] = useState<CustomerOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reordering, setReordering] = useState(false);

    const fetchOrder = useCallback(async () => {
        if (!isLoggedIn) { setLoading(false); return; }
        setLoading(true);
        try {
            const data = await getOrderById(orderId);
            setOrder(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to load order");
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn, orderId]);

    useEffect(() => {
        if (isReady) void fetchOrder();
    }, [isReady, fetchOrder]);

    const handleReorder = async () => {
        if (!order) return;
        setReordering(true);
        try {
            for (const item of order.items) {
                await addToCart(item.productId, item.quantity);
            }
            notifyCartUpdated();
            toast.success("Items added to cart");
            router.push("/cart");
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Failed to add items to cart");
        } finally {
            setReordering(false);
        }
    };

    if (!isReady || loading) {
        return (
            <div className="space-y-6">
                <div className="h-6 bg-white/[0.06] rounded w-40 animate-pulse" />
                <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-6 animate-pulse">
                    <div className="space-y-4">
                        <div className="h-5 bg-white/[0.06] rounded w-48" />
                        <div className="h-4 bg-white/[0.04] rounded w-32" />
                        <div className="h-20 bg-white/[0.04] rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="space-y-4">
                <Link href="/orders" className="flex items-center gap-1.5 text-[#49A5A2] text-[13px] hover:underline">
                    <HugeiconsIcon icon={ArrowLeft02Icon} size={14} /> Back to Orders
                </Link>
                <p className="text-red-400 text-sm">{error || "Order not found"}</p>
            </div>
        );
    }

    const cfg = STATUS_CONFIG[order.status];
    const isCancelled = order.status === "CANCELLED";
    const currentStepIndex = STATUS_STEPS.indexOf(order.status);

    return (
        <div className="space-y-6">
            {/* Back link */}
            <Link href="/orders" className="inline-flex items-center gap-1.5 text-[#49A5A2] text-[13px] font-medium hover:underline">
                <HugeiconsIcon icon={ArrowLeft02Icon} size={14} /> Back to Orders
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-white text-[22px] font-bold tracking-tight">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                    </h1>
                    <p className="text-white/40 text-[13px] mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${cfg.bgColor}`}>
                    <HugeiconsIcon icon={cfg.icon} size={16} className={cfg.color} />
                    <span className={`text-[13px] font-semibold ${cfg.color}`}>{cfg.label}</span>
                </div>
            </div>

            {/* Status Timeline */}
            {!isCancelled && (
                <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-6">
                    <div className="flex items-center justify-between">
                        {STATUS_STEPS.map((step, i) => {
                            const stepCfg = STATUS_CONFIG[step];
                            const isActive = i <= currentStepIndex;
                            const isLast = i === STATUS_STEPS.length - 1;
                            return (
                                <div key={step} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? "bg-[#49A5A2]" : "bg-white/[0.06]"}`}>
                                            <HugeiconsIcon icon={stepCfg.icon} size={14} className={isActive ? "text-white" : "text-white/30"} />
                                        </div>
                                        <span className={`text-[10px] font-medium ${isActive ? "text-white/70" : "text-white/30"}`}>
                                            {stepCfg.label}
                                        </span>
                                    </div>
                                    {!isLast && (
                                        <div className={`flex-1 h-[2px] mx-2 mb-6 ${i < currentStepIndex ? "bg-[#49A5A2]" : "bg-white/[0.08]"}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Cancelled badge */}
            {isCancelled && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
                    <p className="text-red-400 text-[14px] font-medium">This order has been cancelled</p>
                </div>
            )}

            {/* Items */}
            <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06]">
                    <h2 className="text-white text-[15px] font-semibold">
                        Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                    </h2>
                </div>
                <div className="divide-y divide-white/[0.06]">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                            <div className="w-14 h-14 rounded-lg border border-white/[0.08] bg-white/[0.04] flex items-center justify-center shrink-0 overflow-hidden">
                                {item.product.images[0] ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.product.images[0]} alt={item.product.name} className="object-contain w-full h-full p-1" />
                                ) : (
                                    <HugeiconsIcon icon={ShoppingCart01Icon} size={20} className="text-white/25" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <Link href={`/product/${item.product.slug}`} className="text-white text-[14px] font-medium hover:text-[#49A5A2] transition-colors truncate block">
                                    {item.product.name}
                                </Link>
                                <p className="text-white/40 text-[12px] mt-0.5">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-white text-[14px] font-semibold shrink-0">
                                ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary + Address + Payment in a grid */}
            <div className="grid gap-4 sm:grid-cols-2">
                {/* Order Summary */}
                <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-6 space-y-3">
                    <h2 className="text-white text-[15px] font-semibold mb-4">Order Summary</h2>
                    <div className="flex justify-between text-[13px]">
                        <span className="text-white/50">Subtotal</span>
                        <span className="text-white">₹{Number(order.totalAmount).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                        <span className="text-white/50">Delivery</span>
                        <span className="text-emerald-400 font-medium">FREE</span>
                    </div>
                    <div className="border-t border-white/[0.06] pt-3 flex justify-between">
                        <span className="text-white font-semibold text-[14px]">Total</span>
                        <span className="text-white font-bold text-[16px]">₹{Number(order.totalAmount).toLocaleString("en-IN")}</span>
                    </div>
                </div>

                {/* Delivery Address */}
                {order.address && (
                    <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <HugeiconsIcon icon={Location01Icon} size={16} className="text-[#49A5A2]" />
                            <h2 className="text-white text-[15px] font-semibold">Delivery Address</h2>
                        </div>
                        <div className="text-white/60 text-[13px] leading-relaxed">
                            <p className="text-white/80 font-medium">{order.address.label}</p>
                            <p>{order.address.line1}</p>
                            {order.address.line2 && <p>{order.address.line2}</p>}
                            <p>{order.address.city}, {order.address.state} — {order.address.pincode}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Payment Info */}
            <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <HugeiconsIcon icon={CreditCardIcon} size={16} className="text-[#49A5A2]" />
                    <h2 className="text-white text-[15px] font-semibold">Payment</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                        <p className="text-white/40 text-[11px] uppercase tracking-wider mb-1">Method</p>
                        <p className="text-white text-[13px] font-medium">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay"}</p>
                    </div>
                    <div>
                        <p className="text-white/40 text-[11px] uppercase tracking-wider mb-1">Status</p>
                        <p className={`text-[13px] font-medium ${order.paymentStatus === "PAID" ? "text-emerald-400" : order.paymentStatus === "FAILED" ? "text-red-400" : "text-amber-400"}`}>
                            {order.paymentStatus}
                        </p>
                    </div>
                    {order.razorpayPaymentId && (
                        <div>
                            <p className="text-white/40 text-[11px] uppercase tracking-wider mb-1">Payment ID</p>
                            <p className="text-white/60 text-[13px] font-mono">{order.razorpayPaymentId}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={handleReorder}
                    disabled={reordering}
                    className="flex items-center gap-2 px-6 h-11 rounded-lg bg-gradient-to-r from-[#49A5A2] to-[#3d8d8a] text-white text-[14px] font-semibold hover:from-[#5ab5b2] hover:to-[#49A5A2] transition-all shadow-[0_4px_16px_rgba(73,165,162,0.25)] disabled:opacity-50 cursor-pointer"
                >
                    <HugeiconsIcon icon={RepeatIcon} size={16} />
                    {reordering ? "Adding to cart…" : "Reorder"}
                </button>
                <Link
                    href="/"
                    className="flex items-center px-6 h-11 rounded-lg border border-white/[0.08] text-white/70 text-[14px] font-medium hover:bg-white/[0.04] transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
