import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Menu01Icon,
    Search01Icon,
    Location01Icon,
    Store01Icon,
    HeadphonesIcon,
    ArrowRight01Icon,
    ArrowLeft01Icon,
    Cancel01Icon,
    Mic01Icon
} from "@hugeicons/core-free-icons";
import { NAV_CATEGORIES, NavCategory } from "./nav-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Link from "next/link";

function VijayLogo() {
    return (
        <svg viewBox="0 0 160 40" className="h-7 w-auto" fill="none">
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

export function MobileMenu() {
    const [open, setOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<NavCategory | null>(null);

    return (
        <Sheet open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) setTimeout(() => setActiveCategory(null), 300);
        }}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-black hover:bg-transparent">
                    <HugeiconsIcon icon={Menu01Icon} size={28} />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[100vw] sm:w-[400px] p-0 flex flex-col bg-white border-none [&>button]:hidden">
                {/* Custom Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    {activeCategory ? (
                        <button onClick={() => setActiveCategory(null)} className="p-1">
                            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} className="text-black" />
                        </button>
                    ) : (
                        <div className="pt-1">
                            <VijayLogo />
                        </div>
                    )}
                    <button onClick={() => setOpen(false)} className="p-1">
                        <HugeiconsIcon icon={Cancel01Icon} size={24} className="text-black" />
                    </button>
                </div>

                {!activeCategory ? (
                    //* ── MAIN MENU STATE ── *//
                    <ScrollArea className="flex-1 flex flex-col">
                        <div className="px-4 py-3 pb-2 border-b border-gray-100">
                            {/* Search */}
                            <div className="relative mb-3">
                                <HugeiconsIcon
                                    icon={Search01Icon}
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                <Input
                                    placeholder="Search for phone, TV, home appliances..."
                                    className="h-11 w-full rounded-full border-none bg-gray-100/80 pl-10 pr-10 text-[13px] placeholder:text-gray-500"
                                />
                                <HugeiconsIcon
                                    icon={Mic01Icon}
                                    size={18}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-1.5 px-1 py-1">
                                <HugeiconsIcon icon={Location01Icon} size={18} className="text-black" />
                                <p className="text-[13px] text-gray-600">
                                    Ghaziabad 201016 <span className="font-semibold text-black underline underline-offset-2 cursor-pointer">Change Location</span>
                                </p>
                            </div>
                        </div>

                        {/* Actions Split */}
                        <div className="flex items-center border-b border-gray-200">
                            <button className="flex-1 flex items-center justify-center gap-2 py-3.5 hover:bg-gray-50 transition-colors">
                                <HugeiconsIcon icon={Store01Icon} size={18} className="text-primary" />
                                <span className="text-[13px] font-semibold text-gray-900">Store Locator</span>
                            </button>
                            <div className="w-[1px] h-8 bg-gray-200" />
                            <button className="flex-1 flex items-center justify-center gap-2 py-3.5 hover:bg-gray-50 transition-colors">
                                <HugeiconsIcon icon={HeadphonesIcon} size={18} className="text-primary" />
                                <span className="text-[13px] font-semibold text-gray-900">Help Center</span>
                            </button>
                        </div>

                        {/* Categories List */}
                        <div className="py-2 border-b border-gray-200">
                            {NAV_CATEGORIES.map((cat, index) => (
                                cat.subcategories ? (
                                    <button
                                        key={cat.label}
                                        onClick={() => setActiveCategory(cat)}
                                        className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Fallback Icon for main category if not defined */}
                                            <HugeiconsIcon icon={Search01Icon} size={22} className="text-black" />
                                            <span className="text-[14px] font-semibold text-gray-900">{cat.label}</span>
                                        </div>
                                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-gray-900" />
                                    </button>
                                ) : (
                                    <Link
                                        key={cat.label}
                                        href={`/category/${cat.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                        onClick={() => setOpen(false)}
                                        className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <HugeiconsIcon icon={Search01Icon} size={22} className="text-black" />
                                            <span className="text-[14px] font-semibold text-gray-900">{cat.label}</span>
                                        </div>
                                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-gray-900" />
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* Footer Links */}
                        <div className="py-2 border-b border-gray-200">
                            {["About Vijay Sales", "Help Center", "Terms of Use"].map(link => (
                                <Link key={link} href="#" onClick={() => setOpen(false)} className="block px-4 py-3.5 text-[14px] text-gray-600 hover:bg-gray-50">
                                    {link}
                                </Link>
                            ))}
                        </div>

                        {/* Social & Copyright */}
                        <div className="px-4 py-6 flex flex-col items-start gap-4 pb-12">
                            <div className="flex items-center gap-5">
                                {/* Placeholders for social icons */}
                                <div className="w-6 h-6 bg-black rounded-full" />
                                <div className="w-6 h-6 bg-black rounded-full" />
                                <div className="w-6 h-6 bg-black rounded-full" />
                                <div className="w-6 h-6 bg-black rounded-full" />
                                <div className="w-6 h-6 bg-black rounded-full" />
                                <div className="w-6 h-6 bg-black rounded-full" />
                            </div>
                            <p className="text-[13px] text-gray-500">vijaysales.com © 2026</p>
                        </div>
                    </ScrollArea>
                ) : (
                    //* ── SUBCATEGORY MENU STATE ── *//
                    <ScrollArea className="flex-1 flex flex-col">
                        <div className="p-4 pt-2">
                            <h2 className="text-xl font-bold text-foreground mb-2">{activeCategory.label}</h2>
                            <div className="flex flex-col mt-2">
                                {activeCategory.subcategories?.map((sub) => (
                                    <Link
                                        key={sub.label}
                                        href={`/category/${activeCategory.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${sub.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-between py-3.5 border-b border-gray-50 group hover:bg-gray-50"
                                    >
                                        <span className="text-[14px] font-medium text-[#1a202c] pl-1 group-hover:text-primary/90 transition-colors">{sub.label}</span>
                                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-gray-600 mr-2" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Banners */}
                        {activeCategory.banners && (
                            <div className="px-4 pb-8 flex items-center justify-between gap-3 mt-4">
                                <div className={`flex flex-col justify-end w-1/2 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 p-4 aspect-[4/3] relative overflow-hidden shadow-sm`}>
                                    <div className="z-10 relative">
                                        <div className="text-[10px] font-bold italic text-white/90">Trending</div>
                                        <div className="text-sm font-black text-white mt-1 leading-tight uppercase">5G Smartphones</div>
                                        <div className="text-[10px] font-bold text-white uppercase mt-1">UP TO 35% OFF</div>
                                    </div>
                                </div>
                                <div className={`flex flex-col justify-end w-1/2 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 p-4 aspect-[4/3] relative overflow-hidden shadow-sm`}>
                                    <div className="z-10 relative">
                                        <div className="text-[10px] italic text-gray-600">Smart</div>
                                        <div className="text-sm font-black text-gray-900 mt-1 leading-tight uppercase">Tech Accessories</div>
                                        <div className="text-[10px] text-gray-700 mt-1">Starting from ₹1,299</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                )}
            </SheetContent>
        </Sheet>
    );
}
