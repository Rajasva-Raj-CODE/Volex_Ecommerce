"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
    Notification03Icon,
    ShoppingCart01Icon,
    SaleTag01Icon,
    InformationCircleIcon,
} from "@hugeicons/core-free-icons";

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        icon: ShoppingCart01Icon,
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-500/[0.08] border-emerald-500/20",
        title: "Order Delivered!",
        body: "Your Apple MacBook Air M3 has been delivered successfully.",
        time: "2 hours ago",
        unread: true,
    },
    {
        id: 2,
        icon: SaleTag01Icon,
        iconColor: "text-[#49A5A2]",
        iconBg: "bg-[#49A5A2]/[0.08] border-[#49A5A2]/20",
        title: "Flash Sale — Up to 40% off",
        body: "Don't miss our biggest electronics sale of the year. Ends tonight!",
        time: "5 hours ago",
        unread: true,
    },
    {
        id: 3,
        icon: InformationCircleIcon,
        iconColor: "text-amber-400",
        iconBg: "bg-amber-500/[0.08] border-amber-500/20",
        title: "Price Drop Alert",
        body: "Sony WH-1000XM5 from your wishlist dropped by ₹3,000.",
        time: "1 day ago",
        unread: false,
    },
    {
        id: 4,
        icon: Notification03Icon,
        iconColor: "text-white/40",
        iconBg: "bg-white/[0.04] border-white/[0.08]",
        title: "Welcome to VolteX!",
        body: "Start shopping from India's best electronics store.",
        time: "3 days ago",
        unread: false,
    },
];

export default function NotificationsClient() {
    const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-white text-[22px] font-bold tracking-tight">Notifications</h1>
                    {unreadCount > 0 && (
                        <span className="text-[11px] font-semibold bg-[#49A5A2] text-white px-2 py-0.5 rounded-full">
                            {unreadCount} new
                        </span>
                    )}
                </div>
                <button className="text-[13px] text-[#49A5A2] font-medium hover:underline cursor-pointer">
                    Mark all as read
                </button>
            </div>

            <div className="space-y-3">
                {MOCK_NOTIFICATIONS.map((notif) => (
                    <div
                        key={notif.id}
                        className={`rounded-xl border p-4 transition-all duration-200 cursor-pointer group ${notif.unread
                            ? "border-white/[0.12] bg-[#1a1a1a]/80"
                            : "border-white/[0.06] bg-[#1a1a1a]/40"
                            }`}
                    >
                        <div className="flex items-start gap-3.5">
                            <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${notif.iconBg}`}>
                                <HugeiconsIcon icon={notif.icon} size={18} className={notif.iconColor} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className={`text-[13.5px] font-semibold ${notif.unread ? "text-white" : "text-white/60"}`}>
                                        {notif.title}
                                    </p>
                                    <span className="text-white/30 text-[11px] shrink-0">{notif.time}</span>
                                </div>
                                <p className="text-white/40 text-[12.5px] mt-0.5 leading-snug">{notif.body}</p>
                            </div>
                            {notif.unread && (
                                <div className="w-2 h-2 rounded-full bg-[#49A5A2] shrink-0 mt-1.5" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
