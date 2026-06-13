"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Notification03Icon,
    ShoppingCart01Icon,
    SaleTag01Icon,
    InformationCircleIcon,
    Package01Icon,
    Delete02Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseClient } from "@/lib/supabase";
import {
    listNotifications,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    type ApiNotification,
    type NotificationType,
} from "@/lib/notifications-api";

const TYPE_STYLES: Record<NotificationType, { icon: typeof Notification03Icon; iconColor: string; iconBg: string }> = {
    ORDER_PLACED: {
        icon: ShoppingCart01Icon,
        iconColor: "text-[#49A5A2]",
        iconBg: "bg-[#49A5A2]/[0.08] border-[#49A5A2]/20",
    },
    ORDER_CONFIRMED: {
        icon: Package01Icon,
        iconColor: "text-sky-400",
        iconBg: "bg-sky-500/[0.08] border-sky-500/20",
    },
    ORDER_SHIPPED: {
        icon: Package01Icon,
        iconColor: "text-violet-400",
        iconBg: "bg-violet-500/[0.08] border-violet-500/20",
    },
    ORDER_DELIVERED: {
        icon: ShoppingCart01Icon,
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-500/[0.08] border-emerald-500/20",
    },
    ORDER_CANCELLED: {
        icon: InformationCircleIcon,
        iconColor: "text-rose-400",
        iconBg: "bg-rose-500/[0.08] border-rose-500/20",
    },
    PROMO: {
        icon: SaleTag01Icon,
        iconColor: "text-amber-400",
        iconBg: "bg-amber-500/[0.08] border-amber-500/20",
    },
    SYSTEM: {
        icon: Notification03Icon,
        iconColor: "text-white/40",
        iconBg: "bg-white/[0.04] border-white/[0.08]",
    },
};

function timeAgo(iso: string): string {
    const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} mo ago`;
    return `${Math.floor(months / 12)} yr ago`;
}

export default function NotificationsClient() {
    const { user, isReady } = useAuth();
    const [items, setItems] = useState<ApiNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [live, setLive] = useState(false);
    const channelRef = useRef<ReturnType<NonNullable<ReturnType<typeof getSupabaseClient>>["channel"]> | null>(null);

    const refresh = useCallback(async () => {
        try {
            const result = await listNotifications();
            setItems(result.items);
            setUnreadCount(result.unreadCount);
        } catch {
            // silently swallow — page still renders with whatever we have
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isReady) return;
        if (!user) {
            setLoading(false);
            return;
        }
        refresh();
    }, [isReady, user, refresh]);

    useEffect(() => {
        if (!user) return;
        const supabase = getSupabaseClient();
        if (!supabase) return;

        const channel = supabase
            .channel(`user:${user.id}`)
            .on("broadcast", { event: "notification" }, () => {
                refresh();
            })
            .subscribe((status) => {
                setLive(status === "SUBSCRIBED");
            });

        channelRef.current = channel;
        return () => {
            supabase.removeChannel(channel);
            channelRef.current = null;
            setLive(false);
        };
    }, [user, refresh]);

    const handleMarkAll = async () => {
        if (unreadCount === 0) return;
        const prev = items;
        setItems(items.map((n) => (n.readAt ? n : { ...n, readAt: new Date().toISOString() })));
        setUnreadCount(0);
        try {
            await markAllAsRead();
        } catch {
            setItems(prev);
            toast.error("Could not mark all as read");
            refresh();
        }
    };

    const handleClick = async (n: ApiNotification) => {
        if (!n.readAt) {
            setItems((curr) => curr.map((x) => (x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x)));
            setUnreadCount((c) => Math.max(0, c - 1));
            try {
                await markAsRead(n.id);
            } catch {
                refresh();
            }
        }
        if (n.link) window.location.href = n.link;
    };

    const handleDelete = async (id: string) => {
        const prev = items;
        const target = items.find((n) => n.id === id);
        setItems(items.filter((n) => n.id !== id));
        if (target && !target.readAt) setUnreadCount((c) => Math.max(0, c - 1));
        try {
            await deleteNotification(id);
        } catch {
            setItems(prev);
            toast.error("Could not delete notification");
        }
    };

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
                    {live && (
                        <span className="flex items-center gap-1.5 text-[11px] text-emerald-400/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAll}
                        className="text-[13px] text-[#49A5A2] font-medium hover:underline cursor-pointer"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-white/[0.06] bg-[#1a1a1a]/40 p-4 h-[78px] animate-pulse"
                        />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="rounded-xl border border-white/[0.06] bg-[#1a1a1a]/40 p-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] mx-auto mb-3 flex items-center justify-center">
                        <HugeiconsIcon icon={Notification03Icon} size={20} className="text-white/40" />
                    </div>
                    <p className="text-white/80 text-[14px] font-semibold">No notifications yet</p>
                    <p className="text-white/40 text-[12.5px] mt-1">
                        Order updates and offers will show up here.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((n) => {
                        const style = TYPE_STYLES[n.type] ?? TYPE_STYLES.SYSTEM;
                        const unread = !n.readAt;
                        return (
                            <div
                                key={n.id}
                                onClick={() => handleClick(n)}
                                className={`rounded-xl border p-4 transition-all duration-200 cursor-pointer group ${unread
                                    ? "border-white/[0.12] bg-[#1a1a1a]/80"
                                    : "border-white/[0.06] bg-[#1a1a1a]/40"
                                    }`}
                            >
                                <div className="flex items-start gap-3.5">
                                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${style.iconBg}`}>
                                        <HugeiconsIcon icon={style.icon} size={18} className={style.iconColor} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-[13.5px] font-semibold ${unread ? "text-white" : "text-white/60"}`}>
                                                {n.title}
                                            </p>
                                            <span className="text-white/30 text-[11px] shrink-0">{timeAgo(n.createdAt)}</span>
                                        </div>
                                        <p className="text-white/40 text-[12.5px] mt-0.5 leading-snug">{n.body}</p>
                                    </div>
                                    {unread && <div className="w-2 h-2 rounded-full bg-[#49A5A2] shrink-0 mt-1.5" />}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(n.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition text-white/30 hover:text-rose-400 cursor-pointer shrink-0 mt-0.5"
                                        aria-label="Delete notification"
                                    >
                                        <HugeiconsIcon icon={Delete02Icon} size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
