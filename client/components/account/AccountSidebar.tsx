"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    UserAccountIcon,
    Location01Icon,
    ShoppingCart01Icon,
    FavouriteIcon,
    Notification03Icon,
    Settings01Icon,
    Logout01Icon,
} from "@hugeicons/core-free-icons";

const NAV_ITEMS = [
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

// Mock user — replace with your auth context
const user = {
    name: "Raj Kumar",
    email: "raj.kumar@email.com",
};

export default function AccountSidebar() {
    const pathname = usePathname();

    return (
        <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/80 backdrop-blur-sm overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative">
            {/* Right accent glow */}
            <div className="absolute top-0 right-0 w-[3px] h-full bg-gradient-to-b from-[#49A5A2] via-[#49A5A2]/60 to-[#49A5A2]/10" />

            {/* User info */}
            <div className="px-5 py-5 border-b border-white/[0.06] flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#49A5A2] to-[#3d8d8a] flex items-center justify-center shadow-[0_2px_12px_rgba(73,165,162,0.35)] shrink-0">
                    <span className="text-white text-[16px] font-bold">
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

            {/* Nav items */}
            <nav className="py-2 pr-3">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center gap-3.5 px-4 py-3 rounded-lg mx-1 my-0.5 transition-all duration-150
                                ${isActive
                                    ? "bg-[#49A5A2]/[0.12] border border-[#49A5A2]/20"
                                    : "hover:bg-white/[0.04] border border-transparent"
                                }`}
                        >
                            <div className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200
                                ${isActive
                                    ? "border-[#49A5A2]/40 bg-[#49A5A2]/[0.12]"
                                    : "border-white/[0.1] bg-white/[0.03] group-hover:border-[#49A5A2]/30 group-hover:bg-[#49A5A2]/[0.06]"
                                }`}
                            >
                                <HugeiconsIcon
                                    icon={item.icon}
                                    size={17}
                                    className={`transition-colors duration-200 ${isActive ? "text-[#49A5A2]" : "text-white/50 group-hover:text-[#49A5A2]"}`}
                                />
                            </div>
                            <div className="min-w-0">
                                <p className={`text-[13px] font-semibold transition-colors duration-200 ${isActive ? "text-[#49A5A2]" : "text-white group-hover:text-[#49A5A2]"}`}>
                                    {item.title}
                                </p>
                                <p className="text-white/35 text-[11px] mt-0.5 truncate">
                                    {item.subtitle}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Divider + Logout */}
            <div className="border-t border-white/[0.06] mx-4" />
            <div className="py-2 pr-3 pb-3">
                <button
                    onClick={() => console.log("Logout")}
                    className="group flex items-center gap-3.5 px-4 py-3 w-full rounded-lg mx-1 hover:bg-red-500/[0.06] border border-transparent transition-all duration-150 cursor-pointer"
                >
                    <div className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03] group-hover:border-red-500/30 group-hover:bg-red-500/[0.08] transition-all duration-200">
                        <HugeiconsIcon
                            icon={Logout01Icon}
                            size={17}
                            className="text-white/50 group-hover:text-red-400 transition-colors duration-200"
                        />
                    </div>
                    <p className="text-[13px] font-semibold text-white/60 group-hover:text-red-400 transition-colors duration-200">
                        Logout
                    </p>
                </button>
            </div>
        </div>
    );
}
