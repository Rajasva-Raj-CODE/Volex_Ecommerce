"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart01Icon, PackageIcon, DeliveryTruck01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

const MOCK_ORDERS = [
    {
        id: "VX-20261001",
        date: "22 Mar 2026",
        item: "Apple MacBook Air M3",
        image: null,
        price: "₹1,09,900",
        status: "Delivered",
        statusColor: "text-emerald-400",
        statusIcon: Tick02Icon,
    },
    {
        id: "VX-20260987",
        date: "18 Mar 2026",
        item: "Sony WH-1000XM5 Headphones",
        image: null,
        price: "₹22,990",
        status: "Out for Delivery",
        statusColor: "text-[#49A5A2]",
        statusIcon: DeliveryTruck01Icon,
    },
    {
        id: "VX-20260944",
        date: "10 Mar 2026",
        item: "Samsung 55\" QLED 4K TV",
        image: null,
        price: "₹74,990",
        status: "Processing",
        statusColor: "text-amber-400",
        statusIcon: PackageIcon,
    },
];

export default function OrdersClient() {
    return (
        <div className="space-y-6">
            <h1 className="text-white text-[22px] font-bold tracking-tight">My Orders</h1>

            <div className="space-y-4">
                {MOCK_ORDERS.map((order) => (
                    <div
                        key={order.id}
                        className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-5 hover:border-white/[0.14] transition-all duration-200 cursor-pointer group"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                {/* Icon placeholder */}
                                <div className="w-14 h-14 rounded-lg border border-white/[0.08] bg-white/[0.04] flex items-center justify-center shrink-0">
                                    <HugeiconsIcon icon={ShoppingCart01Icon} size={22} className="text-white/25" />
                                </div>
                                <div>
                                    <p className="text-white text-[14px] font-semibold leading-snug group-hover:text-[#49A5A2] transition-colors">
                                        {order.item}
                                    </p>
                                    <p className="text-white/40 text-[12px] mt-1">Order #{order.id} · {order.date}</p>
                                    <div className={`flex items-center gap-1.5 mt-2 ${order.statusColor}`}>
                                        <HugeiconsIcon icon={order.statusIcon} size={13} />
                                        <span className="text-[12px] font-medium">{order.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-white text-[15px] font-bold">{order.price}</p>
                                <button className="mt-2 text-[12px] text-[#49A5A2] font-medium hover:underline cursor-pointer">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
