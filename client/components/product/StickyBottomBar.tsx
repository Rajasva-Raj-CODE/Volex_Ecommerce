"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { addToCart } from "@/lib/cart-api";
import { notifyCartUpdated } from "@/lib/cart-events";
import { ApiError } from "@/lib/api";
import type { ProductDetail } from "@/lib/types";

interface StickyBottomBarProps {
  product: ProductDetail;
}

export default function StickyBottomBar({ product }: StickyBottomBarProps) {
  const router = useRouter();
  const { isLoggedIn, openLoginModal } = useAuth();
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      openLoginModal();
      toast.info("Please login to add items to your cart.");
      return false;
    }

    if (!product.inStock) {
      toast.error("This product is out of stock.");
      return false;
    }

    setAdding(true);
    try {
      await addToCart(product.id, 1);
      notifyCartUpdated();
      toast.success("Added to cart.");
      return true;
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not add this product to cart.");
      return false;
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setBuying(true);
    const added = await handleAddToCart();
    if (added) router.push("/checkout");
    setBuying(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0f0f0f]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Product info */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#1a1a1a]">
            <Image
              src={product.images[0].src}
              alt={product.title}
              fill
              sizes="40px"
              className="object-contain p-0.5"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {product.title}
            </p>
            <p className="text-sm font-black text-white">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            onClick={handleBuyNow}
            disabled={adding || buying}
            className="h-10 rounded-lg border-white/20 bg-transparent px-5 text-sm font-bold text-white hover:bg-[#1a1a1a] hover:text-white sm:px-8"
          >
            {buying ? "Please wait..." : "Buy Now"}
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={adding || buying}
            className="h-10 rounded-lg border-none bg-[#49A5A2] px-5 text-sm font-bold text-black hover:bg-[#3d8e8b] sm:px-8"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
