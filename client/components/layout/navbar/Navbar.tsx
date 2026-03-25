"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Search01Icon,
    Location01Icon,
    FavouriteIcon,
    ShoppingCart01Icon,
    Mic01Icon,
    Cancel01Icon
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { NAV_CATEGORIES } from "./nav-data";
import { MegaDropdown } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import UserDropdown from "./UserDropdown";

// ─── Logo ─────────────────────────────────────────────────────────────────────

function VolteXLogo({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 160 40" className={`h-[28px] w-auto hover:opacity-90 transition-opacity cursor-pointer mt-1 ${className}`} fill="none">
            <text
                x="4"
                y="32"
                fontFamily="'Inter', sans-serif"
                fontSize="32"
                fontStyle="italic"
                fontWeight="900"
                fill="#ffffff"
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

            <header className="sticky top-0 z-50 w-full bg-[#0f0f0f] shadow-lg">

                {/* ── Main header row ── */}
                <div className="bg-[#0f0f0f]">
                    <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-3 py-3 lg:px-4 lg:py-4">

                        {/* Mobile Menu & Logo */}
                        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                            <MobileMenu />
                            <Link href="/">
                                <VolteXLogo />
                            </Link>
                        </div>

                        {/* Search - Desktop Only */}
                        <div className="relative mx-4 flex-1 hidden lg:block max-w-2xl">
                            <HugeiconsIcon
                                icon={Search01Icon}
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 z-30"
                            />
                            <Input
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onFocus={(e) => {
                                    e.preventDefault();
                                    e.target.blur();
                                    setIsSearchFocused(true);
                                }}
                                placeholder="What are you looking for?"
                                className="h-11 w-full rounded-full border-none pl-12 pr-12 text-[14px] bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-0 cursor-text"
                            />
                        </div>

                        {/* Search Modal Overlay */}
                        {isSearchFocused && (
                            <div className="fixed inset-0 z-[100] flex justify-center items-start pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-[2px]">
                                <div className="absolute inset-0" onClick={() => setIsSearchFocused(false)}></div>
                                <div
                                    className="relative w-full max-w-[800px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="relative w-full flex items-center h-[70px] px-6 border-b border-gray-100">
                                        <HugeiconsIcon icon={Search01Icon} size={22} className="text-gray-400 shrink-0" />
                                        <input
                                            autoFocus
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            placeholder="What are you looking for?"
                                            className="w-full h-full bg-transparent border-none outline-none focus:ring-0 px-4 text-[16px] text-gray-900 placeholder:text-gray-400"
                                        />
                                        <button
                                            onClick={() => { setIsSearchFocused(false); setSearchValue(''); }}
                                            className="text-gray-500 hover:text-black shrink-0 p-2"
                                        >
                                            <HugeiconsIcon icon={Cancel01Icon} size={24} />
                                        </button>
                                    </div>

                                    <div className="p-8 text-left max-h-[70vh] overflow-y-auto">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="font-bold text-gray-900 text-[15px]">Trending Searches</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2.5 mb-6">
                                            {[
                                                "Air Conditioners", "Air Coolers", "MacBooks", "iPhone 17", "Televisions",
                                                "Refrigerators", "Nothing 4A", "AirTags", "Air Fryers", "Printer"
                                            ].map(item => (
                                                <button key={item} className="px-4 py-1.5 border border-gray-200 rounded-full text-[13px] text-gray-700 hover:border-[#49A5A2] hover:text-[#49A5A2] transition-colors bg-white">
                                                    {item}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="relative w-full h-[180px] rounded-xl overflow-hidden">
                                            <Image
                                                src="/assets/extracted/HP_Rotating_Apple_MBneo_11March2026_XtdRqQHdE.jpg"
                                                alt="MacBook Neo"
                                                fill
                                                sizes="800px"
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Utility icons */}
                        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">


                            <Button variant="ghost" size="lg" className="hidden lg:flex text-white/70 hover:text-[#49A5A2] hover:bg-white/5 rounded-full cursor-pointer">
                                <HugeiconsIcon icon={FavouriteIcon} size={22} />
                            </Button>

                            <UserDropdown />

                            <Button variant="ghost" size="lg" className="relative text-white hover:bg-white/5 hover:text-[#49A5A2] rounded-full ml-1 cursor-pointer">
                                <HugeiconsIcon icon={ShoppingCart01Icon} size={24} />
                                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#49A5A2] text-[10px] font-bold text-white">0</span>
                            </Button>
                        </div>
                    </div>

                    {/* ── Mobile specific view (Search + Location) ── */}
                    <div className="lg:hidden px-3 pb-3 flex flex-col gap-3">
                        <div className="relative w-full">
                            <HugeiconsIcon
                                icon={Search01Icon}
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                            />
                            <Input
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onFocus={(e) => {
                                    e.preventDefault();
                                    e.target.blur();
                                    setIsSearchFocused(true);
                                }}
                                placeholder="What are you looking for?"
                                className="h-[44px] w-full rounded-full border-none bg-white/10 pl-11 pr-11 text-[14px] text-white placeholder:text-white/40 focus-visible:ring-0 shadow-none cursor-text"
                            />
                            <HugeiconsIcon
                                icon={Mic01Icon}
                                size={20}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 px-1 pb-1">
                            <HugeiconsIcon icon={Location01Icon} size={18} className="text-[#49A5A2]" />
                            <p className="text-[13px] text-white/60">
                                Ghaziabad 201016 <span className="font-semibold text-[#49A5A2] underline underline-offset-2 cursor-pointer">Change</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Category nav bar (Desktop Only) ── */}
                <div
                    className="relative bg-[#0f0f0f] hidden lg:block border-t border-white/10"
                    onMouseLeave={handleLeave}
                >
                    <nav className="mx-auto max-w-screen-xl px-4">
                        <ul className="flex items-center justify-between">
                            {NAV_CATEGORIES.map((cat) => {
                                const isActive = activeCategory === cat.label;

                                return (
                                    <li key={cat.label} onMouseEnter={() => handleEnter(cat.label)} className="flex-1 text-center">
                                        <Link
                                            href={`/category/${cat.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                            className={`flex w-full items-center justify-center gap-1.5 whitespace-nowrap px-2 pb-3 pt-3 text-[12px] font-medium transition-colors ${isActive
                                                ? "text-[#49A5A2] border-b-[2px] border-[#49A5A2]"
                                                : "text-white/60 border-b-[2px] border-transparent hover:text-white"
                                                }`}
                                        >
                                            {cat.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {activeCat?.subcategories && <MegaDropdown category={activeCat} />}
                </div>
            </header>
        </>
    );
}
