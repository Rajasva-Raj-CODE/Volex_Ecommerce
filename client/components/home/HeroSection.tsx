"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import type { HeroBanner } from "@/lib/types"

const defaultBanners: HeroBanner[] = [
  {
    id: "samsung",
    imageSrc: "/assets/extracted/HP_Rotating_Samsung_S26Series_12March2026_KfOzAfswg.jpg",
    imageAlt: "Samsung Galaxy S26 Series",
    mobileImageSrc: "/assets/extracted/MHP_Rotating_Samsung_S26Series_12March2026_cYFq1E0uh.jpg",
  },
  {
    id: "ac",
    imageSrc: "/assets/extracted/HP_Rotating_AC_24March2026_smSkt9wOx.jpg",
    imageAlt: "Air Conditioner Sale",
    mobileImageSrc: "/assets/extracted/MHP_Rotating_AC_24March2026_9ixJ1v0qF.jpg",
  },
  {
    id: "macbook",
    imageSrc: "/assets/extracted/HP_Rotating_Apple_MBneo_11March2026_XtdRqQHdE.jpg",
    imageAlt: "Apple MacBook",
    mobileImageSrc: "/assets/extracted/MHP_Rotating_Apple_MBneo_11March2026_69tfaL9Ed.jpg",
  },
  {
    id: "hp",
    imageSrc: "/assets/extracted/HP_Rotating_HP_24March2026_yhHAc57Bj.jpg",
    imageAlt: "HP Laptops",
    mobileImageSrc: "/assets/extracted/MHP_Rotating_HP_24March2026_Aqcnrlil6.jpg",
  },
  {
    id: "redmi",
    imageSrc: "/assets/extracted/HP_Rotating_redmi_24March2026_t1upCRXpe.jpg",
    imageAlt: "Redmi Smartphones",
    mobileImageSrc: "/assets/extracted/MHP_Rotating_redmi_24March2026_CmjijMTjU.jpg",
  },
  {
    id: "ref",
    imageSrc: "/assets/extracted/HP_Rotating_ref_24March2026_nObrbK0du.jpg",
    imageAlt: "Refrigerators",
    mobileImageSrc: "/assets/extracted/MHP_Rotating_ref_24March2026_yuBkpXA-5.jpg",
  },
  {
    id: "sa",
    imageSrc: "/assets/extracted/HP_Rotating_SA_24March2026_XMxlZz5nB.jpg",
    imageAlt: "Small Appliances",
    mobileImageSrc: "/assets/extracted/MHP_Rotating_SA_24March2026_zVCjI0uWV.jpg",
  },
  {
    id: "tv",
    imageSrc: "/assets/extracted/HP_Rotating_TV_24March2026_KOcXJxvPV.jpg",
    imageAlt: "Smart TVs",
    mobileImageSrc: "/assets/extracted/MHP_Rotating_TV_24March2026_3-4fOV8hG.jpg",
  },
]

// ─── Segmented progress bar ────────────────────────────────────

function SegmentedProgressBar({ count }: { count: number }) {
  const { api } = useCarousel()
  const [selected, setSelected] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    const onSelect = () => setSelected(api.selectedScrollSnap())
    api.on("select", onSelect)
    onSelect()
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <div className="flex items-center gap-1.5 px-4 py-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          className={cn(
            "h-[3px] flex-1 rounded-full transition-all duration-300",
            selected === i ? "bg-[#49A5A2]" : "bg-white/25"
          )}
          onClick={() => api?.scrollTo(i)}
        />
      ))}
    </div>
  )
}

// ─── Single banner slide ─────────────────────────────────────────

function BannerSlide({ banner }: { banner: HeroBanner }) {
  return (
    <div className="relative w-full bg-[#0f0f0f]">
      {/* Desktop image */}
      <div className="relative hidden sm:block w-full h-[87vh]">
        <Image
          src={banner.imageSrc}
          alt={banner.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      </div>
      {/* Mobile image */}
      <div className="relative sm:hidden w-full aspect-[9/16]">
        <Image
          src={banner.mobileImageSrc || banner.imageSrc}
          alt={banner.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      </div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────

type HeroSectionProps = {
  banners?: HeroBanner[]
}

export default function HeroSection({
  banners = defaultBanners,
}: HeroSectionProps) {
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  )

  return (
    <section className="w-full bg-[#0f0f0f]">
      <Carousel
        opts={{ loop: true }}
        plugins={[autoplayPlugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="p-0">
              <BannerSlide banner={banner} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-2 sm:left-4 h-10 w-10 rounded-sm border-0 bg-black/50 text-white hover:bg-black/70" />
        <CarouselNext className="right-2 sm:right-4 h-10 w-10 rounded-sm border-0 bg-black/50 text-white hover:bg-black/70" />

        <div className="bg-[#0f0f0f]">
          <div className="mx-auto max-w-7xl">
            <SegmentedProgressBar count={banners.length} />
          </div>
        </div>
      </Carousel>
    </section>
  )
}
