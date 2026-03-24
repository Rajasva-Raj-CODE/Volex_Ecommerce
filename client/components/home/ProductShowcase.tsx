import Image from "next/image"
import { cn } from "@/lib/utils"

export type ShowcaseBanner = {
  id: string
  imageSrc: string
  imageAlt: string
  href?: string
}

const defaultBanners: ShowcaseBanner[] = [
  {
    id: "nothing",
    imageSrc: "/assets/extracted/HP_SOH_2Split_Nothing4a_13March2026_J-9KTC9JE.png",
    imageAlt: "Nothing Phone 4a 5G",
  },
  {
    id: "oneplus",
    imageSrc: "/assets/extracted/HP_SOH_2Split_OnePlusBuds4Pro_23March2026_8CLUOfj33.png",
    imageAlt: "OnePlus Nord Buds 4 Pro",
  },
  {
    id: "pixel",
    imageSrc: "/assets/extracted/HP_SOH_2Split_Pixel_9March2026_4bx8PoMrL.png",
    imageAlt: "Google Pixel Smartphones",
  },
  {
    id: "vivo",
    imageSrc: "/assets/extracted/HP_SOH_2Split_VivoT5x_24March2026_QXPe0qEGQ.png",
    imageAlt: "Vivo T5x 5G",
  },
]

type ProductShowcaseSectionProps = {
  title?: string
  banners?: ShowcaseBanner[]
  className?: string
}

export default function ProductShowcaseSection({
  title = "Watch Out For This",
  banners = defaultBanners,
  className,
}: ProductShowcaseSectionProps) {
  return (
    <section
      className={cn("w-full bg-[#0f0f0f] py-8", className)}
      aria-label={title}
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <h2 className="mb-5 text-lg font-bold text-white">{title}</h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative overflow-hidden rounded-xl aspect-[1124/481]"
            >
              <Image
                src={banner.imageSrc}
                alt={banner.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
