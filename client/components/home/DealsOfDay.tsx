import Image from "next/image"
import { cn } from "@/lib/utils"

export type DealCard = {
  id: string
  imageSrc: string
  imageAlt: string
  href?: string
}

const defaultItems: DealCard[] = [
  {
    id: "cooktops",
    imageSrc: "/assets/extracted/HP_DOTD_cooktops_24March26_1YfiRx5OS.jpg",
    imageAlt: "Gas Stoves & Induction Cooktops",
  },
  {
    id: "tws",
    imageSrc: "/assets/extracted/HP_DOTD_TWS_24March26_Ec6i4jL5G.jpg",
    imageAlt: "Truly Wireless Earbuds",
  },
  {
    id: "powerbanks",
    imageSrc: "/assets/extracted/HP_DOTD_PB_24March26_g96_NmQj-U.jpg",
    imageAlt: "Power Banks",
  },
  {
    id: "smartwatches",
    imageSrc: "/assets/extracted/HP_DOTD_SW_24March26_gEwQSTlwm.jpg",
    imageAlt: "Bluetooth Calling Smartwatches",
  },
]

type GreaterSavingsDealsSectionProps = {
  title?: string
  items?: DealCard[]
  className?: string
}

export default function GreaterSavingsDealsSection({
  title = "Deals Of The Day",
  items = defaultItems,
  className,
}: GreaterSavingsDealsSectionProps) {
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
              className="relative overflow-hidden rounded-xl aspect-[1124/1479]"
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
