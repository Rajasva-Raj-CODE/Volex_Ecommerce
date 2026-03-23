"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Search01Icon,
    Location01Icon,
    Store01Icon,
    FavouriteIcon,
    UserIcon,
    ShoppingCart01Icon,
    ArrowDown01Icon,
    Mic01Icon,
    Cancel01Icon
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { NAV_CATEGORIES } from "./nav-data";
import { MegaDropdown } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";

// ─── Logo ─────────────────────────────────────────────────────────────────────

function VijayLogo() {
    return (
        <svg viewBox="0 0 160 40" className="h-[28px] w-auto hover:opacity-90 transition-opacity cursor-pointer mt-1" fill="none">
            <text
                x="4"
                y="32"
                fontFamily="'Inter', sans-serif"
                fontSize="32"
                fontStyle="italic"
                fontWeight="900"
                fill="#000"
                letterSpacing="-2"
            >
                VolteX
            </text>
        </svg>
    );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export default function Navbar() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function handleEnter(label: string) {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setActiveCategory(label);
    }

    function handleLeave() {
        closeTimer.current = setTimeout(() => setActiveCategory(null), 120);
    }

    useEffect(
        () => () => {
            if (closeTimer.current) clearTimeout(closeTimer.current);
        },
        []
    );

    // Manage scroll lock when search is active
    useEffect(() => {
        if (isSearchFocused) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isSearchFocused]);

    const activeCat = NAV_CATEGORIES.find((c) => c.label === activeCategory);

    return (
        <>
            <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">

                {/* ── Top bar (Desktop & Mobile combined logic) ── */}
                <div className="bg-white">
                    {/* Primary Row: Hamburger, Logo, Desktop Search, Icons */}
                    <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-3 py-3 lg:px-4 lg:py-5">

                        {/* Mobile Menu & Logo */}
                        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                            <MobileMenu />
                            <Link href="/">
                                <VijayLogo />
                            </Link>
                        </div>

                        {/* Location - Hidden on small screens (Desktop Only) */}
                        <div className="hidden lg:flex shrink-0 items-center gap-2 group cursor-pointer pl-4 border-l border-gray-100">
                            <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                                <HugeiconsIcon icon={Location01Icon} size={18} className="text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-gray-500 font-medium">Deliver to</p>
                                <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">Ghaziabad 201016</p>
                            </div>
                        </div>

                        {/* Search - Desktop Only */}
                        <div className="relative mx-4 flex-1 hidden lg:block max-w-2xl">
                            <HugeiconsIcon
                                icon={Search01Icon}
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-black transition-colors z-30"
                            />
                            <Input
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onFocus={(e) => {
                                    e.preventDefault();
                                    e.target.blur(); // Remove focus from the background input
                                    setIsSearchFocused(true);
                                }}
                                placeholder="Search for phone, TV, home appliances..."
                                className="h-12 w-full rounded-full border border-gray-200 pl-12 pr-12 text-[14px] shadow-sm bg-muted/70 focus-visible:ring-0 cursor-text"
                            />
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent text-gray-400 hover:text-black z-30 opacity-0 pointer-events-none"></button>
                        </div>

                        {/* Search Modal Overlay */}
                        {isSearchFocused && (
                            <div className="fixed inset-0 z-[100] flex justify-center items-start pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-[2px]">
                                {/* Click outside to close */}
                                <div className="absolute inset-0" onClick={() => setIsSearchFocused(false)}></div>

                                <div
                                    className="relative w-full max-w-[800px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Modal Search Headers */}
                                    <div className="relative w-full flex items-center h-[70px] px-6 border-b border-gray-100">
                                        <HugeiconsIcon icon={Search01Icon} size={22} className="text-gray-400 shrink-0" />
                                        <input
                                            autoFocus
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            placeholder="Search for phone, TV, home appliances..."
                                            className="w-full h-full bg-transparent border-none outline-none focus:ring-0 px-4 text-[16px] text-gray-900 placeholder:text-gray-400"
                                        />
                                        <button
                                            onClick={() => { setIsSearchFocused(false); setSearchValue(''); }}
                                            className="text-gray-500 hover:text-black shrink-0 p-2"
                                        >
                                            <HugeiconsIcon icon={Cancel01Icon} size={24} />
                                        </button>
                                    </div>

                                    {/* Modal Content */}
                                    <div className="p-8 text-left max-h-[70vh] overflow-y-auto">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-5 h-5 flex items-center justify-center bg-primary/20 rounded-full text-primary text-[10px]">🔥</div>
                                            <span className="font-bold text-gray-900 text-[15px]">Trending Searches</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2.5 mb-6">
                                            {[
                                                "Air Conditioners", "Air Coolers", "MacBooks", "iPhone 17", "Televisions",
                                                "Refrigerators", "Nothing 4A", "AirTags", "Air Fryers", "Printer"
                                            ].map(item => (
                                                <button key={item} className="px-4 py-1.5 border border-gray-200 rounded-full text-[13px] text-gray-700 hover:border-black hover:text-black transition-colors bg-white">
                                                    {item}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Ad Banner inside Search */}
                                        <div className="w-full h-[180px] bg-muted rounded-xl flex items-center px-8 relative overflow-hidden border border-gray-100">
                                            <div className="z-10 relative">
                                                <div className="flex items-center gap-1 text-black font-bold text-sm mb-1">
                                                    <span>🍎</span> MacBook Neo
                                                </div>
                                                <div className="text-black font-black text-4xl tracking-tighter mb-2">Hello, Neo.</div>
                                                <div className="text-gray-900 font-semibold mb-3">Starting from ₹65,900*</div>
                                                <button className="px-5 py-1.5 rounded-full border border-black text-sm font-semibold hover:bg-black hover:text-white transition-colors">
                                                    Buy Now
                                                </button>
                                                <div className="text-[10px] text-gray-500 mt-4 font-medium">Price inclusive of Bank offers. T&C Apply*</div>
                                            </div>
                                            <div className="absolute -right-8 top-0 bottom-0 w-[55%] bg-gradient-to-l from-green-100 to-transparent flex items-center justify-center">
                                                {/* Stylized Laptop placeholder */}
                                                <div className="w-[180px] h-[120px] bg-yellow-100/50 border-[2px] border-yellow-200 rounded-lg flex items-center justify-center">
                                                    <div className="w-full h-full flex gap-1 p-1">
                                                        <div className="flex-1 bg-gradient-to-b from-green-400 to-blue-300 rounded-sm"></div>
                                                        <div className="flex-1 bg-gradient-to-b from-green-400 to-blue-300 rounded-sm"></div>
                                                        <div className="flex-1 bg-gradient-to-b from-green-400 to-blue-300 rounded-sm"></div>
                                                        <div className="flex-1 bg-gradient-to-b from-green-400 to-blue-300 rounded-sm flex flex-col gap-1 justify-center items-center">
                                                            <div className="w-4 h-4 rounded-full bg-blue-500/50 mt-2"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-center gap-1.5 py-4 pb-1">
                                            {[1, 2, 3, 4, 5, 6, 7].map(dot => (
                                                <div key={dot} className={`w-1.5 h-1.5 rounded-full ${dot === 2 ? 'bg-gray-400' : 'bg-gray-200'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Utility icons */}
                        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
                            {/* Desktop only favorites / stores */}
                            <Button variant="ghost" size="sm" className="hidden lg:flex gap-2 text-sm text-gray-700 hover:text-primary hover:bg-primary/10 rounded-full px-4">
                                <HugeiconsIcon icon={Store01Icon} size={20} />
                                <span className="font-semibold">Stores</span>
                            </Button>

                            <Button variant="ghost" size="icon" className="hidden lg:flex text-gray-700 hover:text-primary hover:bg-primary/10 rounded-full">
                                <HugeiconsIcon icon={FavouriteIcon} size={22} />
                            </Button>

                            {/* User - Always visible on mobile too */}
                            <Button variant="ghost" size="icon" className="relative text-black hover:bg-transparent lg:hover:text-primary lg:hover:bg-primary/10 rounded-full">
                                <HugeiconsIcon icon={UserIcon} size={26} />
                                {/* Red dot badge for User as in screenshot */}
                                <span className="absolute right-1 top-1 flex h-2.5 w-2.5 rounded-full bg-primary border border-white"></span>
                            </Button>

                            {/* Cart - Always visible */}
                            <Button variant="ghost" size="icon" className="relative text-black hover:bg-transparent lg:hover:text-primary lg:hover:bg-primary/10 rounded-full ml-1">
                                <HugeiconsIcon icon={ShoppingCart01Icon} size={26} />
                            </Button>
                        </div>
                    </div>

                    {/* ── Mobile specific view (Search + Location) ── */}
                    <div className="lg:hidden px-3 pb-3 flex flex-col gap-3">
                        {/* Mobile Search Bar */}
                        <div className="relative w-full">
                            <HugeiconsIcon
                                icon={Search01Icon}
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                            <Input
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onFocus={(e) => {
                                    e.preventDefault();
                                    e.target.blur(); // Remove focus from the background input
                                    setIsSearchFocused(true);
                                }}
                                placeholder="Search for phone, TV, home appliances..."
                                className="h-[46px] w-full rounded-full border border-gray-200 bg-muted/70 pl-11 pr-11 text-[15px] placeholder:text-gray-500 focus-visible:ring-0 shadow-none cursor-text"
                            />
                            <HugeiconsIcon
                                icon={Mic01Icon}
                                size={20}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                            />
                        </div>

                        {/* Mobile Location Info */}
                        <div className="flex items-center gap-1.5 px-1 pb-1">
                            <HugeiconsIcon icon={Location01Icon} size={20} className="text-black" />
                            <p className="text-[14px] text-[#2c3e50]">
                                Ghaziabad 201016 <span className="font-semibold text-[#2c3e50] underline underline-offset-2 cursor-pointer">Change Location</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Category nav bar (Desktop Only) ── */}
                <div
                    className="relative bg-white hidden lg:block border-t border-gray-100"
                    onMouseLeave={handleLeave}
                >
                    <nav className="mx-auto max-w-screen-xl px-4">
                        <ul className="flex items-center justify-between">
                            {NAV_CATEGORIES.map((cat) => {
                                const isActive = activeCategory === cat.label;
                                const hasSubs = !!cat.subcategories?.length;

                                return (
                                    <li key={cat.label} onMouseEnter={() => handleEnter(cat.label)} className="flex-1 text-center">
                                        <Link
                                            href={`/category/${cat.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                            className={`flex w-full items-center justify-center gap-1.5 whitespace-nowrap px-2 pb-3.5 pt-4 text-[13px] font-medium transition-colors ${isActive
                                                ? "text-black border-b-[3px] border-black"
                                                : "text-gray-500 border-b-[3px] border-transparent hover:text-black hover:border-gray-200"
                                                }`}
                                        >
                                            {cat.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Mega dropdown */}
                    {activeCat?.subcategories && <MegaDropdown category={activeCat} />}
                </div>
            </header>
        </>
    );
}