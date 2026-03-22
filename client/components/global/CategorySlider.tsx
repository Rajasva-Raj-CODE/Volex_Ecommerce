"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

import { CategoryItem, type CategoryItemProps } from "./CategoryItem"

export type CategorySliderItem = Pick<CategoryItemProps, "label" | "image"> & {
  id: string
}

const defaultCategories: CategorySliderItem[] = [
  { id: "ac", label: "Air Conditioner" },
  { id: "mobiles", label: "Mobiles" },
  { id: "tv", label: "Television" },
  { id: "laptops", label: "Laptops" },
  { id: "washing", label: "Washing Machines" },
  { id: "cooler", label: "Air Cooler" },
]

type CategorySliderProps = {
  items?: CategorySliderItem[]
  className?: string
}

export default function CategorySlider({
  items = defaultCategories,
  className,
}: CategorySliderProps) {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = React.useState({
    widthPct: 100,
    leftPct: 0,
    scrollable: false,
  })
  const [canPrev, setCanPrev] = React.useState(false)
  const [canNext, setCanNext] = React.useState(false)

  const updateScrollMetrics = React.useCallback(() => {
    const el = scrollerRef.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    const scrollable = scrollWidth > clientWidth + 0.5

    if (!scrollable) {
      setThumb({ widthPct: 100, leftPct: 0, scrollable: false })
      setCanPrev(false)
      setCanNext(false)
      return
    }

    const widthPct = Math.min(100, (clientWidth / scrollWidth) * 100)
    const maxScroll = scrollWidth - clientWidth
    const leftPct =
      maxScroll > 0
        ? (scrollLeft / maxScroll) * (100 - widthPct)
        : 0

    setThumb({ widthPct, leftPct, scrollable: true })
    setCanPrev(scrollLeft > 0.5)
    setCanNext(scrollLeft < maxScroll - 0.5)
  }, [])

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
  }, [updateScrollMetrics])

  const scrollByAmount = React.useCallback((direction: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const delta = Math.max(160, Math.floor(el.clientWidth * 0.75)) * direction
    el.scrollBy({ left: delta, behavior: "smooth" })
  }, [])

  return (
    <section
      className={cn("w-full bg-background py-6", className)}
      aria-label="Shop by category"
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <div
          ref={scrollerRef}
          className="scrollbar-none flex gap-30 overflow-x-auto overflow-y-hidden pb-1"
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
            <CategoryItem
              key={item.id}
              label={item.label}
              image={item.image}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div
            className="relative h-1 min-h-px min-w-0 flex-1 overflow-hidden rounded-full bg-muted"
            aria-hidden
          >
            {thumb.scrollable ? (
              <div
                className="absolute top-0 h-full rounded-full bg-foreground/25 transition-[width,left] duration-150 ease-out"
                style={{
                  width: `${thumb.widthPct}%`,
                  left: `${thumb.leftPct}%`,
                }}
              />
            ) : (
              <div className="h-full w-full rounded-full bg-foreground/15" />
            )}
          </div>

          <div className="flex shrink-0 gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-md text-foreground"
              aria-label="Scroll categories left"
              disabled={!canPrev}
              onClick={() => scrollByAmount(-1)}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-md text-foreground"
              aria-label="Scroll categories right"
              disabled={!canNext}
              onClick={() => scrollByAmount(1)}
            >
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
