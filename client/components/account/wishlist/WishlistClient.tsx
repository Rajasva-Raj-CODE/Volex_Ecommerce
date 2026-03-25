"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon, ShoppingCart01Icon, Delete01Icon } from "@hugeicons/core-free-icons";

const MOCK_WISHLIST = [
    { id: 1, name: "iPhone 16 Pro Max 256GB", brand: "Apple", price: "₹1,34,900", originalPrice: "₹1,44,900" },
    { id: 2, name: "Samsung Galaxy S25 Ultra", brand: "Samsung", price: "₹1,19,999", originalPrice: "₹1,29,999" },
    { id: 3, name: "Sony Bravia 65\" OLED 4K TV", brand: "Sony", price: "₹2,29,990", originalPrice: "₹2,49,990" },
    { id: 4, name: "Dyson V15 Detect Absolute", brand: "Dyson", price: "₹62,900", originalPrice: "₹69,900" },
];

export default function WishlistClient() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h1 className="text-white text-[22px] font-bold tracking-tight">My Wishlist</h1>
                <span className="text-white/40 text-[14px]">({MOCK_WISHLIST.length} items)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_WISHLIST.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-4 hover:border-white/[0.14] transition-all duration-200 group"
                    >
                        {/* Image placeholder */}
                        <div className="w-full h-36 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
                            <HugeiconsIcon icon={FavouriteIcon} size={28} className="text-white/10" />
                        </div>

                        <p className="text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1">{item.brand}</p>
                        <p className="text-white text-[13.5px] font-semibold leading-snug mb-2 line-clamp-2">{item.name}</p>

                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-white text-[15px] font-bold">{item.price}</span>
                            <span className="text-white/30 text-[12px] line-through">{item.originalPrice}</span>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg bg-[#49A5A2]/[0.12] border border-[#49A5A2]/25 text-[#49A5A2] text-[12px] font-semibold hover:bg-[#49A5A2]/[0.2] transition-all cursor-pointer">
                                <HugeiconsIcon icon={ShoppingCart01Icon} size={14} />
                                Add to Cart
                            </button>
                            <button className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center hover:border-red-500/30 hover:text-red-400 text-white/30 transition-all cursor-pointer">
                                <HugeiconsIcon icon={Delete01Icon} size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
