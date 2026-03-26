"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import type { ProductDetail } from "@/lib/types";

interface RelatedProductsProps {
  products: ProductDetail[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-5 text-lg font-bold text-white">You May Also Like</h2>
      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-[260px] pl-4 sm:basis-[300px]"
            >
              <Link href={`/product/${product.slug}`} className="group flex flex-col">
                <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 transition-colors group-hover:border-[#49A5A2]/30">
                  <Image
                    src={product.images[0].src}
                    alt={product.images[0].alt}
                    fill
                    sizes="300px"
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mb-1 line-clamp-2 text-sm font-bold text-white transition-colors group-hover:text-[#49A5A2]">
                  {product.title}
                </h3>
                <div className="mb-1 flex items-center gap-1">
                  <span className="text-xs font-bold text-[#49A5A2]">{product.rating}</span>
                  <HugeiconsIcon
                    icon={StarIcon}
                    size={12}
                    className="fill-[#49A5A2] text-[#49A5A2]"
                  />
                  <span className="text-xs text-white/50">({product.reviews})</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-black text-white">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-white/40 line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-3 h-10 w-10 rounded-full border-white/20 bg-black/60 text-white hover:bg-black/80" />
        <CarouselNext className="-right-3 h-10 w-10 rounded-full border-white/20 bg-black/60 text-white hover:bg-black/80" />
      </Carousel>
    </section>
  );
}
