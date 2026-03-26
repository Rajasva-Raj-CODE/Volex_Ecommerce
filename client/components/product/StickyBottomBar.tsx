"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { ProductDetail } from "@/lib/types";

interface StickyBottomBarProps {
  product: ProductDetail;
}

export default function StickyBottomBar({ product }: StickyBottomBarProps) {
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
            className="h-10 rounded-lg border-white/20 bg-transparent px-5 text-sm font-bold text-white hover:bg-[#1a1a1a] hover:text-white sm:px-8"
          >
            Buy Now
          </Button>
          <Button className="h-10 rounded-lg border-none bg-[#49A5A2] px-5 text-sm font-bold text-black hover:bg-[#3d8e8b] sm:px-8">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
