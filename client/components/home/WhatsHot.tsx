import Link from "next/link"
import { cn } from "@/lib/utils"
import { listProducts } from "@/lib/catalog-api"
import HomeProductCard from "./HomeProductCard"

type WhatsHotSectionProps = {
  title?: string
  className?: string
}

// "What's Hot" — premium picks (highest price)
export default async function WhatsHotSection({
  title = "What's Hot",
  className,
}: WhatsHotSectionProps) {
  let products: Awaited<ReturnType<typeof listProducts>>["products"] = []
  try {
    const result = await listProducts({
      sortBy: "price",
      sortOrder: "desc",
      limit: 4,
      isActive: true,
    })
    products = result.products
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
            href="/search?sort=price-desc"
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
