"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
    UserIcon,
    UserAccountIcon,
    Location01Icon,
    ShoppingCart01Icon,
    FavouriteIcon,
    Notification03Icon,
    Settings01Icon,
    Logout01Icon,
    Login01Icon,
} from "@hugeicons/core-free-icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuItem {
    icon: typeof UserAccountIcon;
    title: string;
    subtitle: string;
    href: string;
}

// ─── Menu Data ────────────────────────────────────────────────────────────────

const MENU_ITEMS: MenuItem[] = [
    {
        icon: UserAccountIcon,
        title: "My Profile",
        subtitle: "Edit your basic details",
        href: "/profile",
    },
    {
        icon: Location01Icon,
        title: "My Address",
        subtitle: "Manage your saved addresses",
        href: "/address",
    },
    {
        icon: ShoppingCart01Icon,
        title: "My Orders",
        subtitle: "View, track, cancel orders and buy again",
        href: "/orders",
    },
    {
        icon: FavouriteIcon,
        title: "My Wishlist",
        subtitle: "Have a look at your favourite products",
        href: "/wishlist",
    },
    {
        icon: Notification03Icon,
        title: "Notifications",
        subtitle: "Stay updated with latest alerts",
        href: "/notifications",
    },
    {
        icon: Settings01Icon,
        title: "Settings",
        subtitle: "Manage your account preferences",
        href: "/settings",
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function UserDropdown() {
    // TODO: Replace with actual auth state from your auth provider
    const [isLoggedIn] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Mock user data — replace with real user context
    const user = {
        name: "Raj Kumar",
        email: "raj.kumar@email.com",
    };

    const handleMouseEnter = useCallback(() => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
        openTimer.current = setTimeout(() => setIsOpen(true), 80);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (openTimer.current) {
            clearTimeout(openTimer.current);
            openTimer.current = null;
        }
        closeTimer.current = setTimeout(() => setIsOpen(false), 180);
    }, []);

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* ── Trigger Button ── */}
            <Button
                variant="ghost"
                size="lg"
                className="relative text-white hover:bg-white/5 hover:text-[#49A5A2] rounded-full cursor-pointer"
                aria-haspopup="true"
                aria-expanded={isOpen}
                onFocus={() => setIsOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") setIsOpen(false);
                }}
            >
                <HugeiconsIcon icon={UserIcon} size={24} />
            </Button>

            {/* ── Dropdown Panel ── */}
            <div
                className={`
                    absolute right-0 top-full mt-2 z-[200]
                    w-[340px] origin-top-right
                    transition-all duration-200 ease-out
                    ${isOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
                        : "opacity-0 -translate-y-2 pointer-events-none scale-[0.98]"
                    }
                `}
                role="menu"
                aria-label="User menu"
            >
                {/* ── Pointer triangle ── */}
                <div className="absolute -top-[7px] right-5 w-3.5 h-3.5 rotate-45 bg-[#1a1a1a] border-l border-t border-[#49A5A2]/30" />

                {/* ── Card ── */}
                <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#1a1a1a]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]">

                    {/* Right glowing border accent */}
                    <div className="absolute top-0 right-0 w-[3px] h-full bg-gradient-to-b from-[#49A5A2] via-[#49A5A2]/70 to-[#49A5A2]/20 shadow-[0_0_12px_rgba(73,165,162,0.4)]" />

                    {/* ── Not Logged In State ── */}
                    {!isLoggedIn && (
                        <div className="p-5 pr-6">
                            <p className="text-white/60 text-[13px] mb-4">
                                Sign in to access your account
                            </p>
                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-gradient-to-r from-[#49A5A2] to-[#3d8d8a] text-white text-[14px] font-semibold hover:from-[#5ab5b2] hover:to-[#49A5A2] transition-all duration-200 shadow-[0_4px_16px_rgba(73,165,162,0.3)]"
                                role="menuitem"
                            >
                                <HugeiconsIcon icon={Login01Icon} size={18} />
                                Login / Sign Up
                            </Link>
                        </div>
                    )}

                    {/* ── Logged In State ── */}
                    {isLoggedIn && (
                        <>
                            {/* User info header */}
                            <div className="px-5 pt-5 pb-4 pr-6 border-b border-white/[0.06]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#49A5A2] to-[#3d8d8a] flex items-center justify-center shadow-[0_2px_10px_rgba(73,165,162,0.3)]">
                                        <span className="text-white text-[15px] font-bold">
                                            {user.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white text-[14px] font-semibold truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-white/40 text-[12px] truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu items */}
                            <div className="py-2 pr-3">
                                {MENU_ITEMS.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        role="menuitem"
                                        className="group flex items-center gap-4 px-5 py-3.5 transition-all duration-150 hover:bg-white/[0.04] rounded-lg mx-1"
                                    >
                                        <div className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03] transition-all duration-200 group-hover:border-[#49A5A2]/40 group-hover:bg-[#49A5A2]/[0.08] shrink-0">
                                            <HugeiconsIcon
                                                icon={item.icon}
                                                size={18}
                                                className="text-white/50 transition-colors duration-200 group-hover:text-[#49A5A2]"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white text-[13.5px] font-semibold transition-colors duration-200 group-hover:text-[#49A5A2]">
                                                {item.title}
                                            </p>
                                            <p className="text-white/35 text-[11.5px] mt-0.5 leading-snug truncate">
                                                {item.subtitle}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Divider + Logout */}
                            <div className="border-t border-white/[0.06] mx-4" />
                            <div className="py-2 pr-3 pb-3">
                                <button
                                    role="menuitem"
                                    className="group flex items-center gap-4 px-5 py-3 w-full transition-all duration-150 hover:bg-red-500/[0.06] rounded-lg mx-1 cursor-pointer"
                                    onClick={() => {
                                        // TODO: Handle logout logic
                                        console.log("Logout clicked");
                                    }}
                                >
                                    <div className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03] transition-all duration-200 group-hover:border-red-500/30 group-hover:bg-red-500/[0.08] shrink-0">
                                        <HugeiconsIcon
                                            icon={Logout01Icon}
                                            size={18}
                                            className="text-white/50 transition-colors duration-200 group-hover:text-red-400"
                                        />
                                    </div>
                                    <p className="text-white/60 text-[13.5px] font-semibold transition-colors duration-200 group-hover:text-red-400">
                                        Logout
                                    </p>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
