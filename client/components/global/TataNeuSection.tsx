import Image from "next/image"
import { cn } from "@/lib/utils"

type TataNeuSectionProps = {
  title?: string
  imageSrc?: string
  imageAlt?: string
  className?: string
}

export default function TataNeuSection({
  title = "Experience VolteX On Tata Neu!",
  imageSrc = "/assets/extracted/HP_Neubanner_18April24.png_h4axzq.png",
  imageAlt = "Experience VolteX on Tata Neu",
  className,
}: TataNeuSectionProps) {
  return (
    <section className={cn("w-full bg-[#0f0f0f] py-8", className)}>
      <div className="mx-auto w-full max-w-7xl px-4">
        {title && (
          <h2 className="mb-5 text-lg font-bold text-white">{title}</h2>
        )}
        <div className="relative w-full overflow-hidden rounded-xl aspect-[720/95]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
