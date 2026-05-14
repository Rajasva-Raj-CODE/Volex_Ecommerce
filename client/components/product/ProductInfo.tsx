"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  StarIcon,
  DeliveryTruck01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { ProductDetail } from "@/lib/types";

interface ProductInfoProps {
  product: ProductDetail;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [showAllOffers, setShowAllOffers] = useState(false);

  const visibleOffers = showAllOffers
    ? product.bankOffers
    : product.bankOffers.slice(0, 2);

  return (
    <div className="flex flex-col gap-5">
      {/* Title */}
      <h1 className="text-xl font-black leading-tight text-white sm:text-2xl">
        {product.title}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1">
          <span className="text-sm font-bold text-[#49A5A2]">
            {product.rating}
          </span>
          <HugeiconsIcon
            icon={StarIcon}
            size={14}
            className="fill-[#49A5A2] text-[#49A5A2]"
          />
        </span>
        <span className="text-sm text-[#49A5A2] underline underline-offset-2">
          ({product.ratingCount ?? product.reviews} Ratings &{" "}
          {product.reviews} Reviews)
        </span>
      </div>

      <Separator className="bg-white/10" />

      {/* Price block */}
      <div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-3xl font-black text-white">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.emiStartsAt && (
            <>
              <span className="rounded-full border border-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white/60">
                OR
              </span>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white">
                  {product.emiStartsAt}*
                </span>
                <span className="text-xs font-semibold text-[#49A5A2]">
                  EMI Options
                </span>
              </div>
            </>
          )}
        </div>
        <p className="mt-1 text-xs text-white/40">(Incl. all Taxes)</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-white/40 line-through">
            MRP: ₹{product.originalPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-sm font-medium text-white/60">
            (Save {product.savings}, {product.discount})
          </span>
        </div>
      </div>

      {/* Variant selectors */}
      {product.variants?.map((group) => (
        <div key={group.name}>
          <p className="mb-2 text-sm font-bold text-white">{group.name}</p>
          <div className="flex flex-wrap gap-2">
            {group.options.map((opt) => (
              <button
                key={opt.label}
                className={cn(
                  "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all",
                  opt.selected
                    ? "border-[#49A5A2] bg-transparent text-white"
                    : "border-white/15 bg-transparent text-white/70 hover:border-white/30"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <Separator className="bg-white/10" />

      {/* Super Savings / Bank Offers */}
      <div>
        <h3 className="mb-3 text-base font-bold text-white">
          Super Savings ({product.bankOffers.length} OFFERS)
        </h3>
        <Separator className="mb-4 bg-white/10" />
        <div className="flex gap-3 overflow-x-auto scrollbar-none">
          {visibleOffers.map((offer) => (
            <div
              key={offer.id}
              className="flex min-w-[220px] shrink-0 flex-col gap-2 rounded-lg border border-white/10 bg-[#0f0f0f] p-4"
            >
              <span className="text-sm font-bold text-white">
                {offer.bank}
              </span>
              <p className="line-clamp-3 text-xs leading-relaxed text-white/60">
                {offer.description}
              </p>
              <button className="mt-auto self-start text-xs font-bold text-[#49A5A2] underline underline-offset-2">
                View more
              </button>
            </div>
          ))}
        </div>
        {product.bankOffers.length > 2 && !showAllOffers && (
          <button
            onClick={() => setShowAllOffers(true)}
            className="mt-3 text-xs font-bold text-[#49A5A2] hover:underline"
          >
            View all {product.bankOffers.length} offers
          </button>
        )}
      </div>

      <Separator className="bg-white/10" />

      {/* Delivery info */}
      <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
        <HugeiconsIcon
          icon={Location01Icon}
          size={18}
          className="mt-0.5 shrink-0 text-[#49A5A2]"
        />
        <div>
          <p className="text-sm text-white">
            <span className="font-medium">Delivery at: </span>
            <span className="font-semibold text-[#49A5A2] underline underline-offset-2">
              Mumbai, 400049.
            </span>
          </p>
          <div className="mt-1 flex items-center gap-2">
            <HugeiconsIcon
              icon={DeliveryTruck01Icon}
              size={16}
              className="text-[#49A5A2]"
            />
            <span className="text-xs text-white/60">
              Standard Delivery by{" "}
              <span className="font-bold text-white">
                {product.deliveryDate}
              </span>
            </span>
            {product.deliveryFee && (
              <span className="rounded-sm bg-[#49A5A2]/10 px-2 py-0.5 text-[10px] font-bold text-[#49A5A2]">
                {product.deliveryFee}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="rounded-xl border border-white/10 p-5">
        <h3 className="mb-3 text-base font-bold text-white">Key Features</h3>
        <ul className="flex flex-col gap-2">
          {product.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
              <span className="text-sm font-medium leading-relaxed text-white/80">
                {h.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
