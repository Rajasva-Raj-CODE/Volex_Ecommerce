"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

import { CategoryItem } from "./CategoryItem"

export type CategorySliderItem = {
  id: string
  label: string
  image?: string
}

const defaultCategories: CategorySliderItem[] = [
  { id: "mobiles", label: "Mobiles", image: "/assets/extracted/Mobile_sdtrdf.png" },
  { id: "tv", label: "Televisions", image: "/assets/extracted/TV_vdemgc.png" },
  { id: "laptops", label: "Laptops", image: "/assets/extracted/Laptops_pzewpv.png" },
  { id: "ac", label: "Air Conditioners", image: "/assets/extracted/Air_Conditioner_a4hg1z.png" },
  { id: "coolers", label: "Coolers", image: "/assets/extracted/Cooler_iuchABdv0.png" },
  { id: "fans", label: "Fans", image: "/assets/extracted/Fans_ecnoxj.png" },
  { id: "refrigerators", label: "Refrigerators", image: "/assets/extracted/Ref_biysg7.png" },
  { id: "headphones", label: "Headphones & Earphones", image: "/assets/extracted/Head_set_xjj934.png" },
  { id: "kitchen", label: "Kitchen Appliances", image: "/assets/extracted/Kitchen_Appliances_yhzevo.png" },
  { id: "grooming", label: "Grooming", image: "/assets/extracted/Grooming_vvxudd.png" },
  { id: "cameras", label: "Cameras", image: "/assets/extracted/Cameras_a6n2jy.png" },
  { id: "speakers", label: "Speakers", image: "/assets/extracted/Speaker_g2mbgn.png" },
  { id: "tablets", label: "Tablets", image: "/assets/extracted/Tablets_yzod4f.png" },
  { id: "washing", label: "Washing Machines", image: "/assets/extracted/Washing_machines_izyrnd.png" },
  { id: "accessories", label: "Accessories", image: "/assets/extracted/Accessories_kefony.png" },
  { id: "wearables", label: "Wearables", image: "/assets/extracted/Wearables_iunu7h.png" },
  { id: "microwaves", label: "Microwaves", image: "/assets/extracted/Microwaves_otd6qq.png" },
  { id: "home-theatres", label: "Home Theatres", image: "/assets/extracted/Home_theatres_kpwvft.png" },
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
  const [canPrev, setCanPrev] = React.useState(false)
  const [canNext, setCanNext] = React.useState(false)

  const updateScrollMetrics = React.useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const scrollable = scrollWidth > clientWidth + 0.5
    const maxScroll = scrollWidth - clientWidth
    setCanPrev(scrollable && scrollLeft > 0.5)
    setCanNext(scrollable && scrollLeft < maxScroll - 0.5)
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
      className={cn("w-full bg-[#0f0f0f] py-5", className)}
      aria-label="Shop by category"
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="hidden shrink-0 rounded-full text-white/60 hover:bg-white/10 hover:text-white sm:flex"
            aria-label="Scroll categories left"
            disabled={!canPrev}
            onClick={() => scrollByAmount(-1)}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          </Button>

          <div
            ref={scrollerRef}
            className="scrollbar-none flex flex-1 gap-3 overflow-x-auto overflow-y-hidden py-1 sm:gap-4"
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

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="hidden shrink-0 rounded-full text-white/60 hover:bg-white/10 hover:text-white sm:flex"
            aria-label="Scroll categories right"
            disabled={!canNext}
            onClick={() => scrollByAmount(1)}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
        </div>
      </div>
    </section>
  )
}
