"use client"

import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { useHorizontalCarousel } from "@/hooks/use-horizontal-carousel"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

/** Reference palette */
const RED_ACTIVE = "#D32F2F"
const RED_BADGE = "#E53935"
const GREEN_PREBOOK = "#15803d"
const SWIPER_THEME = "#007aff"
/** Nav arrows — dark gray / near-black (minimal rail UI) */
const NAV_ICON = "#404040"

const FILTERS = [
  "Latest 5G Smartphones",
  "Microwaves",
  "Refrigerators",
  "Washing Machines",
  "Air Conditioners",
  "Televisions",
] as const

export type GreaterSavingsItem = {
  id: string
  title: string
  imageSrc: string
  price: string
  mrp?: string
  discountPercent?: number
  newArrival?: boolean
  bankOffer?: string
  noCostEmi?: boolean
  preBookLabel?: string
}

const defaultItems: GreaterSavingsItem[] = [
  {
    id: "1",
    title:
      "Samsung Galaxy S25 Ultra 5G (12GB RAM, 256GB) | Snapdragon 8 Elite | 200MP Camera",
    imageSrc: "/assets/heroSection/1.jpeg",
    price: "₹42,999",
    mrp: "₹45,999",
    discountPercent: 7,
    newArrival: true,
    bankOffer: "₹3000 Bank Offer",
    noCostEmi: true,
    preBookLabel: "PRE-BOOK NOW AT ₹ 2,000",
  },
  {
    id: "2",
    title:
      "OnePlus 13 5G (16GB RAM, 512GB) | Hasselblad Camera | 6000mAh Battery",
    imageSrc: "/assets/heroSection/2.jpg",
    price: "₹69,999",
    mrp: "₹74,999",
    discountPercent: 7,
    bankOffer: "₹3000 Bank Offer",
    noCostEmi: true,
  },
  {
    id: "3",
    title:
      "Google Pixel 9 Pro 5G (12GB RAM, 256GB) | Tensor G4 | AI Photography",
    imageSrc: "/assets/heroSection/3.jpg",
    price: "₹92,999",
    mrp: "₹99,999",
    discountPercent: 7,
    newArrival: true,
    noCostEmi: true,
  },
  {
    id: "4",
    title:
      "Nothing Phone (3) 5G (12GB RAM, 256GB) | Glyph Interface | 50MP Dual",
    imageSrc: "/assets/heroSection/1.jpeg",
    price: "₹38,999",
    mrp: "₹41,999",
    discountPercent: 7,
    bankOffer: "₹2000 Bank Offer",
  },
  {
    id: "5",
    title:
      "vivo X200 Pro 5G (16GB RAM, 512GB) | ZEISS Optics | MediaTek Dimensity 9400",
    imageSrc: "/assets/heroSection/2.jpg",
    price: "₹84,999",
    mrp: "₹89,999",
    discountPercent: 6,
    noCostEmi: true,
  },
  {
    id: "6",
    title:
      "realme GT 7 Pro 5G (12GB RAM, 256GB) | Snapdragon 8 Elite | 120W Charging",
    imageSrc: "/assets/heroSection/3.jpg",
    price: "₹44,999",
    mrp: "₹49,999",
    discountPercent: 10,
    bankOffer: "₹1500 Bank Offer",
  },
]

function filterByCategory(
  items: GreaterSavingsItem[],
  filter: string
): GreaterSavingsItem[] {
  if (filter === "Latest 5G Smartphones") return items
  return items.slice(0, 4)
}

function ApplianceHeaderArt({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-10 w-[min(100%,220px)] shrink-0 text-neutral-400", className)}
      viewBox="0 0 220 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="currentColor"
        opacity="0.85"
        d="M4 8h10v24H4V8zm14 4h12v16H18V12zm16-2h14v20H34V10zm18 6h11v12H52V16zm14-4h13v20H66V12zm16 2h10v16H82V14zm14 0h12v16H96V14zm16-6h14v24h-14V8zm18 4h11v16h-11V12zm14 2h12v12h-12V14z"
      />
      <rect x="2" y="6" width="16" height="28" rx="2" fill="currentColor" opacity="0.35" />
      <rect x="24" y="10" width="18" height="22" rx="2" fill="currentColor" opacity="0.45" />
      <rect x="48" y="8" width="20" height="26" rx="2" fill="currentColor" opacity="0.4" />
      <rect x="74" y="12" width="14" height="20" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="96" y="10" width="16" height="22" rx="2" fill="currentColor" opacity="0.38" />
      <rect x="118" y="6" width="18" height="28" rx="2" fill="currentColor" opacity="0.42" />
      <rect x="142" y="12" width="20" height="18" rx="2" fill="currentColor" opacity="0.48" />
      <rect x="168" y="8" width="14" height="26" rx="2" fill="currentColor" opacity="0.36" />
      <rect x="188" y="14" width="16" height="16" rx="2" fill="currentColor" opacity="0.44" />
      <rect x="206" y="10" width="12" height="22" rx="2" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

function PreBookTagIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-3.5 shrink-0 text-white", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  )
}

function SavingsDealCard({ item }: { item: GreaterSavingsItem }) {
  return (
    <article
      className="w-[min(280px,calc(100vw-40px))] shrink-0 sm:w-[300px]"
      style={{ fontFamily: "var(--font-roboto), sans-serif" }}
    >
      <div className="relative overflow-hidden rounded-xl bg-white p-0 shadow-sm ring-1 ring-black/5">
        <div className="relative flex aspect-4/3 w-full items-center justify-center bg-white">
          <div className="pointer-events-none absolute left-2 top-2 z-10 flex max-w-[55%] flex-wrap gap-1.5">
            {item.newArrival ? (
              <span className="rounded border border-neutral-900 bg-white px-1.5 py-0.5 text-[10px] font-medium leading-none text-neutral-900">
                New Arrival
              </span>
            ) : null}
          </div>
          <div className="pointer-events-none absolute right-2 top-2 z-10 flex max-w-[55%] flex-col items-end gap-1.5">
            {item.bankOffer ? (
              <span className="rounded border border-neutral-900 bg-white px-1.5 py-0.5 text-[10px] font-medium leading-none text-neutral-900">
                {item.bankOffer}
              </span>
            ) : null}
            {item.noCostEmi ? (
              <span className="rounded border border-neutral-900 bg-white px-1.5 py-0.5 text-[10px] font-medium leading-none text-neutral-900">
                No Cost EMI
              </span>
            ) : null}
          </div>
          <Image
            src={item.imageSrc}
            alt={item.title}
            width={300}
            height={225}
            className="h-auto max-h-[78%] w-auto max-w-[72%] object-contain"
            sizes="(max-width: 640px) 280px, 300px"
          />
        </div>
      </div>

      <div className="mt-3 text-left">
        {item.preBookLabel ? (
          <div
            className="mb-2 flex items-center gap-1.5 rounded px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white sm:text-[11px]"
            style={{ backgroundColor: GREEN_PREBOOK }}
          >
            <PreBookTagIcon />
            <span className="leading-tight">{item.preBookLabel}</span>
          </div>
        ) : null}
        <h3 className="line-clamp-3 text-[13px] font-medium leading-snug tracking-tight text-neutral-900">
          {item.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-lg font-bold tabular-nums text-neutral-900">
            {item.price}
          </span>
          {item.mrp ? (
            <span className="text-xs tabular-nums text-neutral-500 line-through">
              MRP {item.mrp}
            </span>
          ) : null}
          {item.discountPercent != null && item.mrp ? (
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
              style={{ backgroundColor: RED_BADGE }}
            >
              {item.discountPercent}% Off
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

type GreaterSavingsDealsSectionProps = {
  title?: string
  items?: GreaterSavingsItem[]
  backgroundImageUrl?: string | null
  className?: string
}

export default function GreaterSavingsDealsSection({
  title = "Greater Savings Deals",
  items = defaultItems,
  /** Drop `Home_Page_Seson_vice(Desktop) Background.jpg` into `public/assets/greater-savings/` and pass `/assets/greater-savings/seasonal-bg.jpg` */
  backgroundImageUrl,
  className,
}: GreaterSavingsDealsSectionProps) {
  const [activeFilter, setActiveFilter] = React.useState<string>(FILTERS[0])

  const visibleItems = React.useMemo(
    () => filterByCategory(items, activeFilter),
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

  return (
    <section
      className={cn("w-full", className)}
      style={
        {
          ["--swiper-theme-color" as string]: SWIPER_THEME,
          ["--swiper-navigation-size" as string]: "44px",
          WebkitTapHighlightColor: "rgba(0,0,0,0)",
          fontFamily: "var(--font-roboto), sans-serif",
          lineHeight: "normal",
          backgroundColor: "transparent",
          boxSizing: "border-box",
        } as React.CSSProperties
      }
    >
      <div
        className="mx-auto box-border block max-w-[1288px] px-[12px] py-10"
        style={{
          backgroundImage: backgroundImageUrl
            ? `url(${backgroundImageUrl})`
            : undefined,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f4efe6",
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <h2 className="text-[1.5rem] font-bold leading-tight tracking-tight text-neutral-900 sm:text-[1.75rem]">
            {title}
          </h2>
          <ApplianceHeaderArt className="self-start sm:self-auto" />
        </div>

        <div
          className="scrollbar-none -mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1"
          role="tablist"
          aria-label="Product categories"
        >
          {FILTERS.map((label) => {
            const active = activeFilter === label
            return (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveFilter(label)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors sm:px-5 sm:text-[13px]",
                  active
                    ? "border-transparent text-white"
                    : "border-neutral-300 bg-white/80 text-neutral-700 hover:bg-white"
                )}
                style={
                  active
                    ? { backgroundColor: RED_ACTIVE, borderColor: "transparent" }
                    : undefined
                }
              >
                {label}
              </button>
            )
          })}
        </div>

        <div className="mt-6 min-w-0">
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
              <SavingsDealCard key={item.id} item={item} />
            ))}
          </div>

          <div
            className="mt-5 flex items-center gap-3"
            style={
              {
                ["--swiper-navigation-size" as string]: "44px",
              } as React.CSSProperties
            }
          >
            <div
              className="relative h-0.5 min-h-px min-w-0 flex-1 overflow-hidden rounded-full bg-neutral-300/90"
              aria-hidden
            >
              {thumb.scrollable ? (
                <div
                  className="absolute top-1/2 h-[3px] max-h-[3px] -translate-y-1/2 rounded-full bg-neutral-600 transition-[width,left] duration-150 ease-out"
                  style={{
                    width: `${thumb.widthPct}%`,
                    left: `${thumb.leftPct}%`,
                  }}
                />
              ) : (
                <div className="absolute inset-0 rounded-full bg-neutral-300/90" />
              )}
            </div>
            <div className="flex shrink-0 gap-0.5">
              <button
                type="button"
                className="inline-flex size-[44px] items-center justify-center rounded border-0 bg-transparent outline-none transition-opacity hover:opacity-80 disabled:opacity-30"
                style={{
                  color: NAV_ICON,
                  WebkitTapHighlightColor: "rgba(0,0,0,0)",
                }}
                aria-label="Previous"
                disabled={!canPrev}
                onClick={() => scrollByAmount(-1)}
              >
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  className="size-[22px]"
                  strokeWidth={1.75}
                />
              </button>
              <button
                type="button"
                className="inline-flex size-[44px] items-center justify-center rounded border-0 bg-transparent outline-none transition-opacity hover:opacity-80 disabled:opacity-30"
                style={{
                  color: NAV_ICON,
                  WebkitTapHighlightColor: "rgba(0,0,0,0)",
                }}
                aria-label="Next"
                disabled={!canNext}
                onClick={() => scrollByAmount(1)}
              >
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-[22px]"
                  strokeWidth={1.75}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
