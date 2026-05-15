"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon, ShoppingCart01Icon, Delete01Icon } from "@hugeicons/core-free-icons";
import { useAuth } from "@/contexts/AuthContext";
import { getWishlist, removeFromWishlist, type WishlistItem } from "@/lib/wishlist-api";
import { addToCart } from "@/lib/cart-api";
import { ApiError } from "@/lib/api";

export default function WishlistClient() {
    const { isLoggedIn, isReady } = useAuth();
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
    const [error, setError] = useState("");

    const fetchWishlist = useCallback(async () => {
        if (!isLoggedIn) { setLoading(false); return; }
        setLoading(true);
        setError("");
        try {
            const data = await getWishlist();
            setItems(data.items);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isReady) void fetchWishlist();
    }, [isReady, fetchWishlist]);

    const handleRemove = async (productId: string) => {
        setRemovingId(productId);
        try {
            await removeFromWishlist(productId);
            setItems((prev) => prev.filter((i) => i.productId !== productId));
        } catch {
            void fetchWishlist();
        } finally {
            setRemovingId(null);
        }
    };

    const handleAddToCart = async (productId: string) => {
        setAddingToCartId(productId);
        try {
            await addToCart(productId, 1);
        } catch {
            // silently ignore if already in cart
        } finally {
            setAddingToCartId(null);
        }
    };

    if (!isReady || loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-white text-[22px] font-bold tracking-tight">My Wishlist</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-4 animate-pulse">
                            <div className="w-full h-36 rounded-lg bg-white/[0.04] mb-4" />
                            <div className="h-3 bg-white/[0.06] rounded mb-2 w-1/3" />
                            <div className="h-4 bg-white/[0.06] rounded mb-3 w-4/5" />
                            <div className="h-9 bg-white/[0.04] rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <h1 className="text-white text-[22px] font-bold tracking-tight">My Wishlist</h1>
                <p className="text-red-400 text-sm">{error}</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="space-y-6">
                <h1 className="text-white text-[22px] font-bold tracking-tight">My Wishlist</h1>
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center">
                        <HugeiconsIcon icon={FavouriteIcon} size={28} className="text-white/20" />
                    </div>
                    <p className="text-white/40 text-[14px]">Your wishlist is empty</p>
                    <Link href="/" className="text-[#49A5A2] text-[13px] hover:underline">Browse products</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h1 className="text-white text-[22px] font-bold tracking-tight">My Wishlist</h1>
                <span className="text-white/40 text-[14px]">({items.length} {items.length === 1 ? "item" : "items"})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => {
                    const price = Number(item.product.price);
                    const mrp = Number(item.product.mrp) || price;
                    const image = item.product.images[0];

                    return (
                        <div
                            key={item.id}
                            className="rounded-xl border border-white/[0.08] bg-[#1a1a1a]/60 p-4 hover:border-white/[0.14] transition-all duration-200 group"
                        >
                            {/* Image */}
                            <Link href={`/product/${item.product.slug}`}>
                                <div className="w-full h-36 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4 overflow-hidden hover:border-[#49A5A2]/20 transition-colors">
                                    {image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={image} alt={item.product.name} className="object-contain max-h-full max-w-full p-2" />
                                    ) : (
                                        <HugeiconsIcon icon={FavouriteIcon} size={28} className="text-white/10" />
                                    )}
                                </div>
                            </Link>

                            {item.product.brand && (
                                <p className="text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1">{item.product.brand}</p>
                            )}
                            <Link href={`/product/${item.product.slug}`}>
                                <p className="text-white text-[13.5px] font-semibold leading-snug mb-2 line-clamp-2 hover:text-[#49A5A2] transition-colors">
                                    {item.product.name}
                                </p>
                            </Link>

                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-white text-[15px] font-bold">
                                    ₹{price.toLocaleString("en-IN")}
                                </span>
                                {mrp > price && (
                                    <span className="text-white/30 text-[12px] line-through">
                                        ₹{mrp.toLocaleString("en-IN")}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAddToCart(item.productId)}
                                    disabled={addingToCartId === item.productId || !item.product.isActive || item.product.stock === 0}
                                    className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg bg-[#49A5A2]/[0.12] border border-[#49A5A2]/25 text-[#49A5A2] text-[12px] font-semibold hover:bg-[#49A5A2]/[0.2] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <HugeiconsIcon icon={ShoppingCart01Icon} size={14} />
                                    {item.product.stock === 0 ? "Out of Stock" : addingToCartId === item.productId ? "Adding…" : "Add to Cart"}
                                </button>
                                <button
                                    onClick={() => handleRemove(item.productId)}
                                    disabled={removingId === item.productId}
                                    className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center hover:border-red-500/30 hover:text-red-400 text-white/30 transition-all cursor-pointer disabled:opacity-40"
                                >
                                    <HugeiconsIcon icon={Delete01Icon} size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
