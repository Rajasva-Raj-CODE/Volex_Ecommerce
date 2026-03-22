"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useHorizontalCarousel } from "@/hooks/use-horizontal-carousel"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

const ACCENT_RED = "#D32F2F"

export type ExclusiveDealsItem = {
  id: string
  title: string
  imageSrc: string
  price: string
  mrp?: string
  discountPercent?: number
  bankOffer?: string
  boughtLabel?: string
  bestSeller?: boolean
}

const FILTERS = [
  "Price Drop",
  "New Releases",
  "Best Sellers",
  "Trending",
] as const

type FilterId = (typeof FILTERS)[number]

const defaultItems: ExclusiveDealsItem[] = [
  {
    id: "1",
    title:
      "Sony PlayStation 5 (PS5) 2025 Slim Edition with 1TB SSD & DualSense Controller",
    imageSrc: "/assets/heroSection/2.jpg",
    price: "₹54,990",
    mrp: "₹94,990",
    discountPercent: 42,
    bankOffer: "₹3500 Bank Offer",
    boughtLabel: "1500+ Bought",
    bestSeller: true,
  },
  {
    id: "2",
    title:
      "Samsung 55\" 4K Ultra HD Smart QLED TV with Quantum HDR & Voice Assistant",
    imageSrc: "/assets/heroSection/3.jpg",
    price: "₹62,900",
    mrp: "₹89,900",
    discountPercent: 30,
    bankOffer: "₹2500 Bank Offer",
    boughtLabel: "1000+ Bought",
  },
  {
    id: "3",
    title: "Bosch 14 Place Settings Free-Standing Dishwasher with EcoSilence",
    imageSrc: "/assets/heroSection/1.jpeg",
    price: "₹42,490",
    mrp: "₹58,990",
    discountPercent: 28,
    boughtLabel: "800+ Bought",
    bestSeller: true,
  },
  {
    id: "4",
    title:
      "Philips 1.7L Electric Kettle with Keep Warm & Auto Shut-Off — Stainless Steel",
    imageSrc: "/assets/heroSection/2.jpg",
    price: "₹2,199",
    mrp: "₹3,490",
    discountPercent: 37,
    bankOffer: "₹500 Bank Offer",
  },
  {
    id: "5",
    title: "Apple iPhone 17 (256GB Storage, Black) with A19 Chip",
    imageSrc: "/assets/heroSection/1.jpeg",
    price: "₹82,900",
    mrp: "₹92,900",
    discountPercent: 11,
    boughtLabel: "500+ Bought",
  },
  {
    id: "6",
    title: "Apple iPad 11th Gen 2025 Wi-Fi 128GB Blue MD4A4HN/A",
    imageSrc: "/assets/heroSection/3.jpg",
    price: "₹34,900",
    mrp: "₹39,900",
    discountPercent: 13,
    bankOffer: "₹2000 Bank Offer",
    bestSeller: true,
  },
]

function filterItemsByTab(
  items: ExclusiveDealsItem[],
  tab: FilterId
): ExclusiveDealsItem[] {
  if (tab === "Trending") return items
  if (tab === "Price Drop")
    return items.filter((i) => (i.discountPercent ?? 0) >= 25)
  if (tab === "New Releases") return items.slice(0, 4)
  if (tab === "Best Sellers") return items.filter((i) => i.bestSeller)
  return items
}

function ExclusiveDealCard({ item }: { item: ExclusiveDealsItem }) {
  return (
    <article className="w-[min(17.5rem,calc(100vw-2rem))] shrink-0 sm:w-[280px]">
      <div className="rounded-[18px] border border-neutral-200 bg-white p-0 dark:border-border dark:bg-card">
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[14px] border border-neutral-200 bg-white dark:border-border">
          <div className="absolute left-2 top-2 z-10 flex max-w-[calc(100%-1rem)] flex-wrap gap-1.5">
            {item.bankOffer ? (
              <span className="rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[0.625rem] font-medium leading-tight text-neutral-900 shadow-sm dark:border-border dark:bg-background dark:text-foreground">
                {item.bankOffer}
              </span>
            ) : null}
            {item.boughtLabel ? (
              <span className="rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[0.625rem] font-medium leading-tight text-neutral-900 shadow-sm dark:border-border dark:bg-background dark:text-foreground">
                {item.boughtLabel}
              </span>
            ) : null}
            {item.bestSeller ? (
              <span className="rounded-full bg-neutral-950 px-2 py-0.5 text-[0.625rem] font-semibold text-white dark:bg-foreground dark:text-background">
                Best Seller
              </span>
            ) : null}
          </div>
          <Image
            src={item.imageSrc}
            alt={item.title}
            width={280}
            height={280}
            className="h-auto max-h-[78%] w-auto max-w-[78%] object-contain"
            sizes="(max-width: 639px) min(280px, 85vw), 280px"
          />
        </div>
      </div>

      <div className="mt-3 w-full space-y-2 text-left">
        <h3
          className="line-clamp-2 text-[0.8125rem] font-semibold leading-snug tracking-tight text-neutral-900 dark:text-foreground"
          title={item.title}
        >
          {item.title}
        </h3>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm font-bold tabular-nums text-neutral-900 dark:text-foreground">
            {item.price}
          </span>
          {item.mrp ? (
            <span className="text-[0.6875rem] tabular-nums text-neutral-500 line-through dark:text-muted-foreground">
              MRP {item.mrp}
            </span>
          ) : null}
          {item.discountPercent != null && item.mrp ? (
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[0.625rem] font-semibold text-white"
              style={{ backgroundColor: ACCENT_RED }}
            >
              {item.discountPercent}% Off
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

type ExclusiveDealsSectionProps = {
  title?: string
  viewAllLabel?: string
  viewAllHref?: string
  items?: ExclusiveDealsItem[]
  defaultFilter?: FilterId
  className?: string
}

export default function ExclusiveDealsSection({
  title = "Exclusive Deals & Offers",
  viewAllLabel = "View All",
  viewAllHref,
  items = defaultItems,
  defaultFilter = "Trending",
  className,
}: ExclusiveDealsSectionProps) {
  const [activeFilter, setActiveFilter] = React.useState<FilterId>(defaultFilter)

  const visibleItems = React.useMemo(
    () => filterItemsByTab(items, activeFilter),
    [items, activeFilter]
  )

  const {
    scrollerRef,
    thumb,
    canPrev,
    canNext,
    updateScrollMetrics,
    scrollByAmount,
  } = useHorizontalCarousel()

  React.useLayoutEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollLeft = 0
    updateScrollMetrics()
  }, [visibleItems, updateScrollMetrics])

  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    updateScrollMetrics()
    el.addEventListener("scroll", updateScrollMetrics, { passive: true })
    const ro = new ResizeObserver(updateScrollMetrics)
    ro.observe(el)

    return () => {
      el.removeEventListener("scroll", updateScrollMetrics)
      ro.disconnect()
    }
  }, [updateScrollMetrics, scrollerRef])

  const viewAllClass =
    "h-9 shrink-0 rounded-full bg-neutral-950 px-6 text-xs font-medium text-white hover:bg-neutral-900 dark:bg-foreground dark:text-background dark:hover:bg-foreground/90"

  return (
    <section
      className={cn("w-full bg-white py-10 dark:bg-background", className)}
      aria-label={title}
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-6 flex flex-col gap-4">
          <h2 className="text-[1.5rem] font-bold leading-tight tracking-tight text-neutral-950 sm:text-[1.65rem] dark:text-foreground">
            {title}
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div
              className="scrollbar-none -mx-1 flex min-w-0 flex-1 flex-nowrap gap-2 overflow-x-auto px-1 pb-0.5 sm:flex-wrap sm:overflow-visible"
              role="tablist"
              aria-label="Deal categories"
            >
              {FILTERS.map((label) => {
                const isActive = activeFilter === label
                return (
                  <button
                    key={label}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveFilter(label)}
                    className={cn(
                      "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                      isActive
                        ? "border-transparent text-white"
                        : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-muted/50"
                    )}
                    style={
                      isActive
                        ? { backgroundColor: ACCENT_RED, borderColor: "transparent" }
                        : undefined
                    }
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {viewAllHref ? (
              <Button asChild className={cn(viewAllClass, "self-start sm:self-center")}>
                <Link href={viewAllHref}>{viewAllLabel}</Link>
              </Button>
            ) : (
              <Button type="button" className={cn(viewAllClass, "self-start sm:self-center")}>
                {viewAllLabel}
              </Button>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <div
            ref={scrollerRef}
            className="scrollbar-none -mx-1 flex gap-4 overflow-x-auto overflow-y-hidden px-1 pb-1 sm:gap-5"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault()
                scrollByAmount(-1)
              } else if (e.key === "ArrowRight") {
                e.preventDefault()
                scrollByAmount(1)
              }
            }}
          >
            {visibleItems.map((item) => (
              <ExclusiveDealCard key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div
              className="relative h-0.5 min-h-px min-w-0 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-muted"
              aria-hidden
            >
              {thumb.scrollable ? (
                <div
                  className="absolute top-0 h-full rounded-full bg-neutral-500 transition-[width,left] duration-150 ease-out dark:bg-foreground/40"
                  style={{
                    width: `${thumb.widthPct}%`,
                    left: `${thumb.leftPct}%`,
                  }}
                />
              ) : (
                <div className="h-full w-full rounded-full bg-neutral-300/80 dark:bg-foreground/15" />
              )}
            </div>

            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 disabled:opacity-40 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-muted/80"
                aria-label="Scroll deals left"
                disabled={!canPrev}
                onClick={() => scrollByAmount(-1)}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={1.75} className="size-4" />
              </button>
              <button
                type="button"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 disabled:opacity-40 dark:border-border dark:bg-muted dark:text-foreground dark:hover:bg-muted/80"
                aria-label="Scroll deals right"
                disabled={!canNext}
                onClick={() => scrollByAmount(1)}
              >
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.75} className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
