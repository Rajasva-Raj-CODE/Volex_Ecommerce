"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon, Share01Icon } from "@hugeicons/core-free-icons";
import { Checkbox } from "@/components/ui/checkbox";
import type { ProductDetailImage } from "@/lib/types";

interface ProductImageGalleryProps {
  images: ProductDetailImage[];
  title: string;
}

export default function ProductImageGallery({
  images,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const currentImage = images[selectedIndex];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    },
    []
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Top icons row */}
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-[#49A5A2]"
          >
            <HugeiconsIcon
              icon={FavouriteIcon}
              size={18}
              className={cn(
                "text-white/70",
                isWishlisted && "fill-[#49A5A2] text-[#49A5A2]"
              )}
            />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-[#49A5A2]">
            <HugeiconsIcon
              icon={Share01Icon}
              size={18}
              className="text-white/70"
            />
          </button>
        </div>
      </div>

      {/* Gallery: thumbnails + main image */}
      <div className="relative flex flex-col-reverse gap-4 lg:flex-row">
        {/* Thumbnail strip */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none lg:flex-col lg:overflow-y-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-[#1a1a1a] transition-all lg:h-[72px] lg:w-[72px]",
                selectedIndex === i
                  ? "border-[#49A5A2]"
                  : "border-white/10 hover:border-white/30"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="72px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>

        {/* Main image with hover zoom trigger */}
        <div
          ref={imageRef}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          className="relative flex-1 aspect-square cursor-crosshair overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a]"
        >
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-8"
            priority
          />
        </div>

        {/* Zoom panel — appears to the right on desktop */}
        {isZooming && (
          <div
            className="pointer-events-none absolute left-[calc(100%+16px)] top-0 z-50 hidden aspect-square w-[500px] overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-2xl lg:block"
          >
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `url(${currentImage.src})`,
                backgroundSize: "250%",
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom bar: Compare */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="compare-product"
            className="h-4 w-4 rounded-[4px] border-white/40 data-[state=checked]:border-[#49A5A2] data-[state=checked]:bg-[#49A5A2]"
          />
          <label
            htmlFor="compare-product"
            className="cursor-pointer text-sm font-medium text-white"
          >
            Compare
          </label>
        </div>
      </div>
    </div>
  );
}
