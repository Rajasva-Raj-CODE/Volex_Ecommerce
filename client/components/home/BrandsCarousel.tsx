"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useHorizontalCarousel } from "@/hooks/use-horizontal-carousel"

export type BrandCard = {
  id: string
  imageSrc: string
  imageAlt: string
  href?: string
}

const defaultBrands: BrandCard[] = [
  { id: "1", imageSrc: "/assets/extracted/1_maspxu.png", imageAlt: "Apple" },
  { id: "2", imageSrc: "/assets/extracted/2_bki1il.png", imageAlt: "Bose" },
  { id: "3", imageSrc: "/assets/extracted/3_voajbz.png", imageAlt: "Croma" },
  { id: "4", imageSrc: "/assets/extracted/4_wmg1qj.png", imageAlt: "Dell" },
  { id: "5", imageSrc: "/assets/extracted/5_pjm9wd.png", imageAlt: "Haier" },
  { id: "6", imageSrc: "/assets/extracted/6_cruwwo.png", imageAlt: "HP" },
  { id: "7", imageSrc: "/assets/extracted/7_uvvozm.png", imageAlt: "LG" },
  { id: "8", imageSrc: "/assets/extracted/8_dvwyxd.png", imageAlt: "Samsung" },
  { id: "9", imageSrc: "/assets/extracted/9_rqohp4.png", imageAlt: "Sony" },
  { id: "10", imageSrc: "/assets/extracted/10_iobxyi.png", imageAlt: "Whirlpool" },
  { id: "11", imageSrc: "/assets/extracted/11_tc1idk.png", imageAlt: "Xiaomi" },
  { id: "12", imageSrc: "/assets/extracted/12_hfsle3.png", imageAlt: "Panasonic" },
  { id: "13", imageSrc: "/assets/extracted/13_fbzbpw.png", imageAlt: "Philips" },
  { id: "14", imageSrc: "/assets/extracted/14_xtc6jg.png", imageAlt: "Voltas" },
]

type BrandsSectionProps = {
  brands?: BrandCard[]
  className?: string
}

export default function BrandsSection({
  brands = defaultBrands,
  className,
}: BrandsSectionProps) {
  const {
    scrollerRef,
    canPrev,
    canNext,
    updateScrollMetrics,
    scrollByAmount,
  } = useHorizontalCarousel()

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
    <section className={cn("w-full bg-[#0f0f0f] py-6", className)}>
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="relative flex items-center">
          {/* Left chevron */}
          <button
            type="button"
            onClick={() => scrollByAmount(-1)}
            disabled={!canPrev}
            className="mr-3 shrink-0 text-2xl text-white/30 transition-colors hover:text-white/60 disabled:invisible"
            aria-label="Scroll brands left"
          >
            ‹
          </button>

          <div
            ref={scrollerRef}
            className="scrollbar-none flex min-w-0 flex-1 gap-3 overflow-x-auto"
          >
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="relative shrink-0 overflow-hidden rounded-lg bg-[#2a2a2a] aspect-[4/3] w-[calc((100%-3rem)/5)]
                  max-[900px]:w-[calc((100%-2.25rem)/4)]
                  max-[640px]:w-[calc((100%-1.5rem)/3)]"
              >
                <Image
                  src={brand.imageSrc}
                  alt={brand.imageAlt}
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 900px) 25vw, 20vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Right chevron */}
          <button
            type="button"
            onClick={() => scrollByAmount(1)}
            disabled={!canNext}
            className="ml-3 shrink-0 text-2xl text-white/30 transition-colors hover:text-white/60 disabled:invisible"
            aria-label="Scroll brands right"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
