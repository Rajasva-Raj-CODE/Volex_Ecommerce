"use client"

import * as React from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@/lib/utils"

export type BlogPost = {
  id: string
  imageSrc: string
  imageAlt: string
  title: string
  subtitle?: string
  href?: string
}

const defaultPosts: BlogPost[] = [
  {
    id: "b1",
    imageSrc: "/assets/extracted/HP_Blog_1_17Sept2025_ANAI_bY8UC.png",
    imageAlt: "Blog Post 1",
    title: "Google Pixel 10 Pro XL review",
    subtitle:
      "The big screen champion gets everything right... well almost",
  },
  {
    id: "b2",
    imageSrc: "/assets/extracted/HP_Blog_2_17Sept2025_vFQ1Vcmux8.png",
    imageAlt: "Blog Post 2",
    title: "Best Laptops for Every Budget",
    subtitle:
      "From everyday browsing to high-performance gaming — find your match.",
  },
  {
    id: "b3",
    imageSrc: "/assets/extracted/HP_Blog_3_17Sept2025_zbJUe4oSeU.png",
    imageAlt: "Blog Post 3",
    title: "Smart Home Essentials Guide",
    subtitle:
      "Transform your living space with must-have smart devices and appliances.",
  },
  {
    id: "b4",
    imageSrc: "/assets/extracted/HP_Blog_4_17Sept2025_uMyVgCeJ5w.png",
    imageAlt: "Blog Post 4",
    title: "Summer Cooling Solutions",
    subtitle:
      "Beat the heat with our top picks for ACs, coolers, and fans.",
  },
]

type PromoBannerPairProps = {
  title?: string
  posts?: BlogPost[]
  className?: string
}

export default function PromoBannerPair({
  title = "Unboxed by VolteX",
  posts = defaultPosts,
  className,
}: PromoBannerPairProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  return (
    <section className={cn("w-full bg-[#0f0f0f] py-8", className)}>
      <div className="mx-auto w-full max-w-7xl px-4">
        <h2 className="mb-5 text-lg font-bold text-white">{title}</h2>
      </div>

      {/* Full-width carousel — 100vw wide, 80vh tall */}
      <div className="relative w-full">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center text-4xl text-white/40 transition-colors hover:text-white/80 sm:left-4"
          aria-label="Previous slide"
        >
          ‹
        </button>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center text-4xl text-white/40 transition-colors hover:text-white/80 sm:right-4"
          aria-label="Next slide"
        >
          ›
        </button>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {posts.map((post) => (
              <div key={post.id} className="min-w-0 flex-[0_0_100%]">
                <div className="relative h-[80vh] w-full overflow-hidden">
                  {/* Background image */}
                  <Image
                    src={post.imageSrc}
                    alt={post.imageAlt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                  />

                  {/* Text overlay on right side */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="ml-auto flex w-full flex-col justify-center px-6 sm:w-1/2 sm:px-10 lg:px-16">
                      <div className="rounded-xl bg-black/50 p-5 backdrop-blur-sm sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
                        <h3 className="text-xl font-extrabold leading-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
                          {post.title}
                        </h3>
                        {post.subtitle && (
                          <p className="mt-2 text-sm text-white/70 sm:mt-3 sm:text-base lg:text-lg">
                            {post.subtitle}
                          </p>
                        )}
                        <button
                          type="button"
                          className="mt-4 rounded-lg bg-[#49A5A2] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3d8d8a] sm:mt-5 sm:px-8 sm:py-3 sm:text-base"
                        >
                          Read Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {posts.map((post, i) => (
            <button
              key={post.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                selectedIndex === i
                  ? "w-8 bg-white"
                  : "w-4 bg-white/30 hover:bg-white/50"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
