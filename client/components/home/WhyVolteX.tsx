import Image from "next/image"
import { cn } from "@/lib/utils"

type WhyVolteXSectionProps = {
  title?: string
  imageSrc?: string
  imageAlt?: string
  className?: string
}

export default function WhyVolteXSection({
  title = "Why VolteX?",
  imageSrc = "/assets/extracted/Why-Croma_t2lgxr.png",
  imageAlt = "Why VolteX?",
  className,
}: WhyVolteXSectionProps) {
  return (
    <section className={cn("w-full bg-[#0f0f0f] py-8", className)}>
      <div className="mx-auto w-full max-w-7xl px-4">
        {title && (
          <h2 className="mb-5 text-lg font-bold text-white">{title}</h2>
        )}
        <div className="relative w-full overflow-hidden rounded-xl aspect-[720/155]">
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
