import Image from "next/image"
import { cn } from "@/lib/utils"

export type WhatsHotCard = {
  id: string
  imageSrc: string
  imageAlt: string
  href?: string
}

const defaultItems: WhatsHotCard[] = [
  {
    id: "oneplus",
    imageSrc: "/assets/extracted/HP_What_sHot_oneplus_25March2026_eb58iFDm-g.jpg",
    imageAlt: "OnePlus",
  },
  {
    id: "ac",
    imageSrc: "/assets/extracted/HP_What_sHot_AC_25March2026_cj3MNfmQv.jpg",
    imageAlt: "2026 AC Series",
  },
  {
    id: "tv",
    imageSrc: "/assets/extracted/HP_What_sHot_TV_25March2026_Kwjc7hHKI0.jpg",
    imageAlt: "Smart TVs",
  },
  {
    id: "ipad",
    imageSrc: "/assets/extracted/HP_What_sHot_ipad_25March2026_8rtlzkTZ3I.jpg",
    imageAlt: "iPad",
  },
]

type WhatsHotSectionProps = {
  title?: string
  items?: WhatsHotCard[]
  className?: string
}

export default function WhatsHotSection({
  title = "What's Hot",
  items = defaultItems,
  className,
}: WhatsHotSectionProps) {
  return (
    <section
      className={cn("w-full bg-[#0f0f0f] py-8", className)}
      aria-label={title}
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <h2 className="mb-5 text-lg font-bold text-white">{title}</h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-xl aspect-[1124/1473]"
            >
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
