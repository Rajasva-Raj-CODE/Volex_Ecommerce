import Link from "next/link"
import { cn } from "@/lib/utils"
import { listProducts, type ApiProduct } from "@/lib/catalog-api"
import HomeProductCard from "./HomeProductCard"

type GreaterSavingsDealsSectionProps = {
  title?: string
  className?: string
}

function asNumber(v: string | number | null | undefined) {
  if (v == null) return undefined
  const n = typeof v === "string" ? parseFloat(v) : v
  return Number.isFinite(n) ? n : undefined
}

function discountPct(p: ApiProduct) {
  const price = asNumber(p.price) ?? 0
  const mrp = asNumber(p.mrp)
  if (!mrp || mrp <= price) return 0
  return ((mrp - price) / mrp) * 100
}

// "Deals Of The Day" — top 4 by discount percentage.
// Sorted client-side after fetching, since the server doesn't sort by discount.
export default async function GreaterSavingsDealsSection({
  title = "Deals Of The Day",
  className,
}: GreaterSavingsDealsSectionProps) {
  let products: ApiProduct[] = []
  try {
    const result = await listProducts({
      sortBy: "createdAt",
      sortOrder: "desc",
      limit: 30,
      isActive: true,
    })
    products = [...result.products]
      .sort((a, b) => discountPct(b) - discountPct(a))
      .filter((p) => discountPct(p) > 0)
      .slice(0, 4)
  } catch {
    // ignore
  }

  if (products.length === 0) return null

  return (
    <section
      className={cn("w-full bg-[#0f0f0f] py-8", className)}
      aria-label={title}
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <Link
            href="/search"
            className="text-xs font-semibold text-[#49A5A2] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {products.map((p) => (
            <HomeProductCard key={p.id} product={p} imageAspect="tall" />
          ))}
        </div>
      </div>
    </section>
  )
}
