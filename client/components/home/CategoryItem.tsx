import Image from "next/image"
import { cn } from "@/lib/utils"

export type CategoryItemProps = {
  label: string
  image?: string
  className?: string
}

export function CategoryItem({ label, image, className }: CategoryItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-20 shrink-0 flex-col items-center gap-2 sm:w-24",
        "group cursor-pointer",
        className
      )}
    >
      <div
        className={cn(
          "flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl",
          "bg-gradient-to-br from-[#1a1a3e] to-[#0d1b2a]",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
          "transition-all duration-200",
          "group-hover:ring-2 group-hover:ring-[#49A5A2]/50 group-hover:scale-105"
        )}
      >
        {image ? (
          <Image
            src={image}
            alt={label}
            width={96}
            height={96}
            className="h-[70%] w-[70%] object-contain"
            sizes="96px"
          />
        ) : (
          <div className="h-8 w-8 rounded-lg bg-white/10" />
        )}
      </div>
      <p className="w-full text-center text-[0.65rem] font-medium leading-tight text-white/80 sm:text-[0.7rem]">
        {label}
      </p>
    </button>
  )
}
