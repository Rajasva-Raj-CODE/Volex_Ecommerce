import Image from "next/image"
import { cn } from "@/lib/utils"

export type FromVolteXCard = {
  id: string
  imageSrc: string
  imageAlt: string
  href?: string
}

const defaultItems: FromVolteXCard[] = [
  {
    id: "acs",
    imageSrc: "/assets/extracted/HP_CC_3Split_ACs_01March2026_f34B2BN6n.png",
    imageAlt: "Air Conditioners",
  },
  {
    id: "cooler",
    imageSrc: "/assets/extracted/HP_CC_3Split_cooler_17March26_T9o9k4tnF.png",
    imageAlt: "Coolers",
  },
  {
    id: "tv",
    imageSrc: "/assets/extracted/HP_CC_3Split_TV_28Jan26_PGRpzp01L.png",
    imageAlt: "Smart TVs",
  },
]

type FromVolteXSectionProps = {
  title?: string
  items?: FromVolteXCard[]
  className?: string
}

export default function FromVolteXSection({
  title = "From VolteX to You",
  items = defaultItems,
  className,
}: FromVolteXSectionProps) {
  return (
    <section
      className={cn("w-full bg-[#0f0f0f] py-8", className)}
      aria-label={title}
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <h2 className="mb-5 text-lg font-bold text-white">{title}</h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-xl aspect-[720/452]"
            >
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
