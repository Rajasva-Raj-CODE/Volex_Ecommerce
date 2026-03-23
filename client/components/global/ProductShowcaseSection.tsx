"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import { useHorizontalCarousel } from "@/hooks/use-horizontal-carousel"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

export type ProductShowcaseItem = {
  id: string
  title: string
  imageSrc: string
  price: string
  mrp?: string
  discountPercent?: number
}

const ACCENT_RED = "#D32F2F"
const IMAGE_BG = "#E5E5E5"

const defaultItems: ProductShowcaseItem[] = [
  {
    id: "1",
    title: "Apple iPhone 17e (256GB Storage) Soft Pink",
    imageSrc: "/assets/heroSection/1.jpeg",
    price: "₹62,900",
    mrp: "₹64,900",
    discountPercent: 3,
  },
  {
    id: "2",
    title:
      "Apple MacBook Air M5 Chip (16GB RAM/ 512GB SSD/ 13 Inch Liquid Retina Display/ 10‑core CPU and 8‑core GPU/ Silver) - MDH74HN/A",
    imageSrc: "/assets/heroSection/2.jpg",
    price: "₹1,19,900",
  },
  {
    id: "3",
    title: "Apple iPhone 17 Pro (256GB Storage, Cosmic Orange)",
    imageSrc: "/assets/heroSection/3.jpg",
    price: "₹1,34,900",
    mrp: "₹1,37,900",
    discountPercent: 2,
  },
  {
    id: "4",
    title: "Apple iPhone 17 (256GB Storage, Black)",
    imageSrc: "/assets/heroSection/1.jpeg",
    price: "₹82,900",
    mrp: "₹85,900",
    discountPercent: 3,
  },
  {
    id: "5",
    title:
      "Apple AirTag (2nd generation) | Bluetooth Tracker for Keys, Bags & Luggage | Precision Finding | Pack of 1",
    imageSrc: "/assets/heroSection/2.jpg",
    price: "₹3,490",
    mrp: "₹3,990",
    discountPercent: 13,
  },
  {
    id: "6",
    title: "Apple iPad 11th Gen 2025 Wi-Fi 128GB Blue MD4A4HN/A",
    imageSrc: "/assets/heroSection/3.jpg",
    price: "₹34,900",
    mrp: "₹36,900",
    discountPercent: 5,
  },
]

function ProductRailCard({ item }: { item: ProductShowcaseItem }) {
  return (
    <article className="w-[min(17.5rem,calc(100vw-2rem))] shrink-0 sm:w-[420px]">
      <HoverCard openDelay={120} closeDelay={80}>
        <HoverCardTrigger asChild>
          <div
            className="flex aspect-square w-full max-w-full cursor-default items-center justify-center overflow-hidden rounded-[18px] outline-none"
            style={{ backgroundColor: IMAGE_BG }}
            tabIndex={0}
          >
            <Image
              src={item.imageSrc}
              alt={item.title}
              width={420}
              height={420}
              className="h-auto max-h-[86%] w-auto max-w-[86%] object-contain"
              sizes="(max-width: 639px) min(280px, 85vw), 420px"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          side="top"
          sideOffset={6}
          align="center"
          className="w-auto max-w-68 border border-neutral-200 bg-neutral-100 px-2.5 py-1.5 text-xs font-normal text-neutral-900 shadow-sm dark:border-border dark:bg-muted dark:text-foreground"
        >
          {item.title}
        </HoverCardContent>
      </HoverCard>

      <div className="mt-3 w-full space-y-2 text-left">
        <h3
          className="line-clamp-2 text-[0.8125rem] font-medium leading-snug tracking-tight text-neutral-900 dark:text-foreground"
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

type ProductShowcaseSectionProps = {
  title?: string
  description?: string
  emiLabel?: string
  viewAllLabel?: string
  viewAllHref?: string
  items?: ProductShowcaseItem[]
  className?: string
}

export default function ProductShowcaseSection({
  title = "Best Of Apple",
  description =
  "Save up to ₹5,000 instantly on eligible products using ICICI & AXIS Bank Credit Cards. Exchange bonus up to ₹6,000 on iPhone. T&C apply.",
  emiLabel = "No Cost EMI Available",
  viewAllLabel = "View All",
  viewAllHref,
  items = defaultItems,
  className,
}: ProductShowcaseSectionProps) {
  const {
    scrollerRef,
    thumb,
    canPrev,
    canNext,
    updateScrollMetrics,
    scrollByAmount,
  } = useHorizontalCarousel()

  React.useLayoutEffect(() => {
    updateScrollMetrics()
  }, [items, updateScrollMetrics])

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

  const viewAllButtonClass =
    "mt-2 h-9 w-fit rounded-full bg-neutral-950 px-7 text-xs font-medium text-white hover:bg-neutral-900 dark:bg-foreground dark:text-background dark:hover:bg-foreground/90"

  return (
    <section
      className={cn("w-full bg-white py-10 dark:bg-background", className)}
      aria-label={title}
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
          {/* ~25% intro column */}
          <div className="flex w-full max-w-sm shrink-0 flex-col gap-4 lg:w-[min(100%,22rem)] lg:max-w-none">
            <h2 className="text-[1.65rem] font-bold leading-tight tracking-tight text-neutral-950 sm:text-3xl dark:text-foreground">
              {title}
            </h2>
            <p className="text-sm leading-relaxed text-neutral-800 dark:text-foreground/90">
              {description}
            </p>
            <Separator className="bg-neutral-200 dark:bg-border" />
            <p className="flex items-start gap-1.5 text-sm font-semibold text-neutral-950 dark:text-foreground">
              <span
                className="mt-0.5 select-none font-bold"
                style={{ color: ACCENT_RED }}
                aria-hidden
              >
                *
              </span>
              <span>{emiLabel}</span>
            </p>
            {viewAllHref ? (
              <Button asChild className={viewAllButtonClass}>
                <Link href={viewAllHref}>{viewAllLabel}</Link>
              </Button>
            ) : (
              <Button type="button" className={viewAllButtonClass}>
                {viewAllLabel}
              </Button>
            )}
          </div>

          {/* ~75% carousel — partial card peek on the right */}
          <div className="min-w-0 flex-1 lg:pt-0.5">
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
              {items.map((item) => (
                <ProductRailCard key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div
                className="relative h-0.5 min-h-px min-w-0 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-muted"
                aria-hidden
              >
                {thumb.scrollable ? (
                  <div
                    className="absolute top-0 h-full rounded-full bg-neutral-400 transition-[width,left] duration-150 ease-out dark:bg-foreground/35"
                    style={{
                      width: `${thumb.widthPct}%`,
                      left: `${thumb.leftPct}%`,
                    }}
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-neutral-300/80 dark:bg-foreground/15" />
                )}
              </div>

              <div className="flex shrink-0 gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-md text-neutral-400 hover:bg-transparent hover:text-neutral-600 dark:text-muted-foreground dark:hover:text-foreground"
                  aria-label="Scroll products left"
                  disabled={!canPrev}
                  onClick={() => scrollByAmount(-1)}
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={1.75} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-md text-neutral-400 hover:bg-transparent hover:text-neutral-600 dark:text-muted-foreground dark:hover:text-foreground"
                  aria-label="Scroll products right"
                  disabled={!canNext}
                  onClick={() => scrollByAmount(1)}
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.75} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
