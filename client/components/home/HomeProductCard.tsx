import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ApiProduct } from "@/lib/catalog-api"

function inr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`
}

function asNumber(v: string | number | null | undefined) {
  if (v == null) return undefined
  const n = typeof v === "string" ? parseFloat(v) : v
  return Number.isFinite(n) ? n : undefined
}

type HomeProductCardProps = {
  product: ApiProduct
  className?: string
  imageAspect?: "square" | "tall"
}

export default function HomeProductCard({
  product,
  className,
  imageAspect = "square",
}: HomeProductCardProps) {
  const price = asNumber(product.price) ?? 0
  const mrp = asNumber(product.mrp)
  const discount =
    mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0
  const image = product.images?.[0]
  const rating = asNumber(product.rating)

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn("group block", className)}
      aria-label={product.name}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-white",
          imageAspect === "tall" ? "aspect-[3/4]" : "aspect-square"
        )}
      >
        {discount > 0 && (
          <div className="absolute left-2 top-2 z-10 rounded-md bg-[#49A5A2] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-white">
            {discount}% off
          </div>
        )}
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-300">
            No image
          </div>
        )}
      </div>

      <div className="mt-3 px-1">
        <p className="line-clamp-2 text-[0.8rem] font-medium leading-snug text-white/85 sm:text-sm">
          {product.name}
        </p>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-base font-bold text-white">{inr(price)}</span>
          {mrp && mrp > price && (
            <span className="text-xs text-white/40 line-through">{inr(mrp)}</span>
          )}
        </div>
        {rating !== undefined && rating > 0 && (
          <div className="mt-1 inline-flex items-center gap-1 rounded bg-[#1f3a39] px-1.5 py-0.5 text-[0.65rem] font-semibold text-[#49A5A2]">
            <span>{rating.toFixed(1)}</span>
            <span>★</span>
          </div>
        )}
      </div>
    </Link>
  )
}
