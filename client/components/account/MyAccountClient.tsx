"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    UserAccountIcon,
    Location01Icon,
    ShoppingCart01Icon,
    FavouriteIcon,
    Notification03Icon,
    Settings01Icon,
    ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// ─── Config ───────────────────────────────────────────────────────────────────

const ACCOUNT_ITEMS = [
    { icon: UserAccountIcon,    title: "My Profile",      subtitle: "Edit your basic details",                   href: "/profile" },
    { icon: Location01Icon,     title: "My Address",      subtitle: "Manage your saved addresses",               href: "/address" },
    { icon: ShoppingCart01Icon, title: "My Orders",       subtitle: "View, track, cancel orders and buy again",  href: "/orders" },
    { icon: FavouriteIcon,      title: "My Wishlist",     subtitle: "Have a look at your favourite products",    href: "/wishlist" },
    { icon: Notification03Icon, title: "Notifications",   subtitle: "Stay updated with latest alerts",           href: "/notifications" },
    { icon: Settings01Icon,     title: "Settings",        subtitle: "Manage your account preferences",           href: "/settings" },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function MyAccountClient() {
    const { user, logout } = useAuth();

    return (
        <div className="w-full flex-1 max-w-7xl mx-auto px-4 py-8 lg:py-12">

            {/* Breadcrumb */}
            <p className="text-white/30 text-[12px] font-medium mb-6 tracking-wide">My Account</p>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-white text-[28px] font-bold tracking-tight">My Account</h1>
                    {user && (
                        <p className="text-white/40 text-[13px] mt-1">
                            Welcome back,{" "}
                            <span className="text-[#49A5A2] font-medium">{user.name}</span>
                        </p>
                    )}
                </div>

                {/* User info pill */}
                {user && (
                    <div className="flex items-center gap-3 bg-[#1a1a1a]/80 border border-white/8 rounded-xl px-4 py-3 backdrop-blur-sm">
                        <Avatar size="lg" className="bg-linear-to-br from-[#49A5A2] to-[#3d8d8a] shadow-[0_2px_12px_rgba(73,165,162,0.35)]">
                            <AvatarFallback className="bg-transparent text-white font-bold text-[15px]">
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-white text-[13px] font-semibold">{user.name}</p>
                            <p className="text-white/40 text-[11px]">{user.phone}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ACCOUNT_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="group flex items-center gap-4 p-5 rounded-xl border border-white/7 bg-[#1a1a1a]/60 hover:bg-[#1f1f1f]/90 hover:border-[#49A5A2]/25 transition-all duration-200 backdrop-blur-sm"
                    >
                        <div className="w-14 h-14 rounded-2xl border border-white/8 bg-white/4 flex items-center justify-center shrink-0 transition-all duration-200 group-hover:border-[#49A5A2]/30 group-hover:bg-[#49A5A2]/8">
                            <HugeiconsIcon
                                icon={item.icon}
                                size={24}
                                className="text-white/45 transition-colors duration-200 group-hover:text-[#49A5A2]"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-[14.5px] font-semibold transition-colors duration-200 group-hover:text-[#49A5A2] leading-snug">
                                {item.title}
                            </p>
                            <p className="text-white/35 text-[12px] mt-1 leading-snug">{item.subtitle}</p>
                        </div>
                        <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={16}
                            className="text-white/20 transition-all duration-200 group-hover:text-[#49A5A2] group-hover:translate-x-0.5 shrink-0"
                        />
                    </Link>
                ))}
            </div>

            {/* Logout */}
            <Separator className="mt-6 bg-white/6" />
            <div className="pt-4">
                <Button
                    variant="ghost"
                    onClick={logout}
                    className="text-white/30 text-[13px] hover:text-red-400 hover:bg-transparent px-0 cursor-pointer"
                >
                    Log out from this account
                </Button>
            </div>
        </div>
    );
}
