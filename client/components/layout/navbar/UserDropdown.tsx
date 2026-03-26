"use client";

import { useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
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

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// ─── Menu items config ────────────────────────────────────────────────────────

const MENU_ITEMS = [
    { icon: UserAccountIcon,    title: "My Profile",      subtitle: "Edit your basic details",                   href: "/profile" },
    { icon: Location01Icon,     title: "My Address",      subtitle: "Manage your saved addresses",               href: "/address" },
    { icon: ShoppingCart01Icon, title: "My Orders",       subtitle: "View, track, cancel orders and buy again",  href: "/orders" },
    { icon: FavouriteIcon,      title: "My Wishlist",     subtitle: "Have a look at your favourite products",    href: "/wishlist" },
    { icon: Notification03Icon, title: "Notifications",   subtitle: "Stay updated with latest alerts",           href: "/notifications" },
    { icon: Settings01Icon,     title: "Settings",        subtitle: "Manage your account preferences",           href: "/settings" },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function UserDropdown() {
    const { isLoggedIn, user, logout, openLoginModal } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const openTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = useCallback(() => {
        if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
        openTimer.current = setTimeout(() => setIsOpen(true), 80);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null; }
        closeTimer.current = setTimeout(() => setIsOpen(false), 180);
    }, []);

    const handleUserIconClick = () => {
        if (isLoggedIn) router.push("/my-account");
        else openLoginModal();
    };

    const handleMenuItemClick = (href: string) => {
        setIsOpen(false);
        if (isLoggedIn) router.push(href);
        else openLoginModal();
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Trigger */}
            <Button
                variant="ghost"
                size="lg"
                aria-label={isLoggedIn ? "My Account" : "Login"}
                aria-haspopup="true"
                aria-expanded={isOpen}
                onClick={handleUserIconClick}
                className="relative text-white hover:bg-white/5 hover:text-[#49A5A2] rounded-full cursor-pointer"
            >
                <HugeiconsIcon icon={UserIcon} size={24} />
            </Button>

            {/* Dropdown panel — always shown on hover */}
            <div
                role="menu"
                aria-label="User menu"
                className={`absolute right-0 top-full mt-2 z-[200] w-[340px] origin-top-right
                    transition-all duration-200 ease-out
                    ${isOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
                        : "opacity-0 -translate-y-2 pointer-events-none scale-[0.98]"
                    }`}
            >
                {/* Pointer tip */}
                <div className="absolute -top-[7px] right-5 w-3.5 h-3.5 rotate-45 bg-[#1a1a1a] border-l border-t border-[#49A5A2]/30" />

                <div className="relative overflow-hidden rounded-xl border border-white/8 bg-[#1a1a1a]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]">

                    {/* Right glow accent */}
                    <div className="absolute top-0 right-0 w-[2px] h-full bg-linear-to-b from-[#49A5A2] via-[#49A5A2]/60 to-transparent pointer-events-none" />

                    {/* ── Header: logged-in ── */}
                    {isLoggedIn && user ? (
                        <div className="px-5 pt-5 pb-4 pr-6 border-b border-white/6">
                            <div className="flex items-center gap-3">
                                <Avatar size="lg" className="bg-linear-to-br from-[#49A5A2] to-[#3d8d8a] shadow-[0_2px_10px_rgba(73,165,162,0.3)]">
                                    <AvatarFallback className="bg-transparent text-white font-bold text-[15px]">
                                        {user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="text-white text-[14px] font-semibold truncate">{user.name}</p>
                                    <p className="text-white/40 text-[12px] truncate">{user.phone}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ── Header: not logged in ── */
                        <div className="px-5 pt-5 pb-4 pr-6 border-b border-white/6">
                            <p className="text-white/50 text-[13px] mb-3">Sign in to access your account</p>
                            <Button
                                onClick={() => { setIsOpen(false); openLoginModal(); }}
                                className="w-full h-10 bg-linear-to-r from-[#49A5A2] to-[#3d8d8a] text-white text-[13px] font-semibold hover:from-[#5ab5b2] hover:to-[#49A5A2] shadow-[0_4px_14px_rgba(73,165,162,0.3)] cursor-pointer"
                            >
                                <HugeiconsIcon icon={Login01Icon} size={16} />
                                Login / Sign Up
                            </Button>
                        </div>
                    )}

                    {/* ── Menu items ── */}
                    <div className="py-2 pr-3">
                        {MENU_ITEMS.map((item) => (
                            <button
                                key={item.href}
                                role="menuitem"
                                onClick={() => handleMenuItemClick(item.href)}
                                className="group flex items-center gap-4 px-5 py-3.5 w-full text-left transition-all duration-150 hover:bg-white/4 rounded-lg mx-1 cursor-pointer"
                            >
                                <div className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 bg-white/3 shrink-0 transition-all duration-200 group-hover:border-[#49A5A2]/40 group-hover:bg-[#49A5A2]/8">
                                    <HugeiconsIcon
                                        icon={item.icon}
                                        size={18}
                                        className="text-white/50 transition-colors duration-200 group-hover:text-[#49A5A2]"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-white text-[13.5px] font-semibold transition-colors duration-200 group-hover:text-[#49A5A2]">
                                        {item.title}
                                    </p>
                                    <p className="text-white/35 text-[11.5px] mt-0.5 leading-snug truncate">
                                        {item.subtitle}
                                    </p>
                                </div>
                                {/* Lock icon for protected items when logged out */}
                                {!isLoggedIn && (
                                    <span className="text-white/15 text-[11px] shrink-0">🔒</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ── Logout ── */}
                    {isLoggedIn && (
                        <>
                            <Separator className="mx-4 bg-white/6 w-auto" />
                            <div className="py-2 pr-3 pb-3">
                                <button
                                    role="menuitem"
                                    onClick={() => { setIsOpen(false); logout(); }}
                                    className="group flex items-center gap-4 px-5 py-3 w-full text-left transition-all duration-150 hover:bg-red-500/6 rounded-lg mx-1 cursor-pointer"
                                >
                                    <div className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 bg-white/3 shrink-0 transition-all duration-200 group-hover:border-red-500/30 group-hover:bg-red-500/8">
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
