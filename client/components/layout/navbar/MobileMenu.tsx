import { useState } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

function VolteXLogo() {
    return (
        <svg viewBox="0 0 160 40" className="h-7 w-auto" fill="none">
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

export function MobileMenu() {
    const [open, setOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<NavCategory | null>(null);

    return (
        <Sheet open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) setTimeout(() => setActiveCategory(null), 300);
        }}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
                    <HugeiconsIcon icon={Menu01Icon} size={28} />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-screen sm:w-[400px] p-0 flex flex-col bg-[#0f0f0f] border-none [&>button]:hidden">
                {/* Custom Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    {activeCategory ? (
                        <button onClick={() => setActiveCategory(null)} className="p-1">
                            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} className="text-white" />
                        </button>
                    ) : (
                        <div className="pt-1">
                            <VolteXLogo />
                        </div>
                    )}
                    <button onClick={() => setOpen(false)} className="p-1">
                        <HugeiconsIcon icon={Cancel01Icon} size={24} className="text-white/70" />
                    </button>
                </div>

                {!activeCategory ? (
                    <ScrollArea className="flex-1 flex flex-col">
                        <div className="px-4 py-3 pb-2 border-b border-white/10">
                            {/* Search */}
                            <div className="relative mb-3">
                                <HugeiconsIcon
                                    icon={Search01Icon}
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                                />
                                <Input
                                    placeholder="What are you looking for?"
                                    className="h-11 w-full rounded-full border-none bg-white/10 pl-10 pr-10 text-[13px] text-white placeholder:text-white/40"
                                />
                                <HugeiconsIcon
                                    icon={Mic01Icon}
                                    size={18}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                                />
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-1.5 px-1 py-1">
                                <HugeiconsIcon icon={Location01Icon} size={18} className="text-[#49A5A2]" />
                                <p className="text-[13px] text-white/60">
                                    Ghaziabad 201016 <span className="font-semibold text-[#49A5A2] underline underline-offset-2 cursor-pointer">Change</span>
                                </p>
                            </div>
                        </div>

                        {/* Actions Split */}
                        <div className="flex items-center border-b border-white/10">
                            <button className="flex-1 flex items-center justify-center gap-2 py-3.5 hover:bg-white/5 transition-colors">
                                <HugeiconsIcon icon={Store01Icon} size={18} className="text-[#49A5A2]" />
                                <span className="text-[13px] font-semibold text-white/80">Store Locator</span>
                            </button>
                            <div className="w-px h-8 bg-white/10" />
                            <button className="flex-1 flex items-center justify-center gap-2 py-3.5 hover:bg-white/5 transition-colors">
                                <HugeiconsIcon icon={HeadphonesIcon} size={18} className="text-[#49A5A2]" />
                                <span className="text-[13px] font-semibold text-white/80">Help Center</span>
                            </button>
                        </div>

                        {/* Categories List */}
                        <div className="py-2 border-b border-white/10">
                            {NAV_CATEGORIES.map((cat) => (
                                cat.subcategories ? (
                                    <button
                                        key={cat.label}
                                        onClick={() => setActiveCategory(cat)}
                                        className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-white/5 transition-colors"
                                    >
                                        <span className="text-[14px] font-semibold text-white/80">{cat.label}</span>
                                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-white/40" />
                                    </button>
                                ) : (
                                    <Link
                                        key={cat.label}
                                        href={`/category/${cat.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                        onClick={() => setOpen(false)}
                                        className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-white/5 transition-colors"
                                    >
                                        <span className="text-[14px] font-semibold text-white/80">{cat.label}</span>
                                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-white/40" />
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* Footer Links */}
                        <div className="py-2 border-b border-white/10">
                            {["About VolteX", "Help Center", "Terms of Use"].map(link => (
                                <Link key={link} href="#" onClick={() => setOpen(false)} className="block px-4 py-3.5 text-[14px] text-white/50 hover:bg-white/5">
                                    {link}
                                </Link>
                            ))}
                        </div>

                        {/* Copyright */}
                        <div className="px-4 py-6 pb-12">
                            <p className="text-[13px] text-white/30">voltex.com &copy; 2026</p>
                        </div>
                    </ScrollArea>
                ) : (
                    <ScrollArea className="flex-1 flex flex-col">
                        <div className="p-4 pt-2">
                            <h2 className="text-xl font-bold text-white mb-2">{activeCategory.label}</h2>
                            <div className="flex flex-col mt-2">
                                {activeCategory.subcategories?.map((sub) => (
                                    <Link
                                        key={sub.label}
                                        href={`/category/${activeCategory.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${sub.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-between py-3.5 border-b border-white/5 group hover:bg-white/5"
                                    >
                                        <span className="text-[14px] font-medium text-white/70 pl-1 group-hover:text-[#49A5A2] transition-colors">{sub.label}</span>
                                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-white/30 mr-2" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {activeCategory.banners?.images && activeCategory.banners.images.length > 0 && (
                            <div className="flex flex-col gap-3 px-4 pb-8 mt-4">
                                {activeCategory.banners.images.map((src, i) => (
                                    <div key={i} className="relative w-full overflow-hidden rounded-xl aspect-[21/9]">
                                        <Image
                                            src={src}
                                            alt={`${activeCategory.label} promo ${i + 1}`}
                                            fill
                                            sizes="100vw"
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                )}
            </SheetContent>
        </Sheet>
    );
}
