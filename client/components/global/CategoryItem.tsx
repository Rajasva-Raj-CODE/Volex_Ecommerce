import Image from "next/image"
import type { StaticImageData } from "next/image"

import { cn } from "@/lib/utils"

export type CategoryItemProps = {
  label: string
  /** Product image; omit until assets are ready — a neutral placeholder is shown */
  image?: StaticImageData | string
  className?: string
}

export function CategoryItem({ label, image, className }: CategoryItemProps) {
  return (
    <div
      className={cn(
        "flex w-22 shrink-0 flex-col items-center gap-2 sm:w-28 md:w-32",
        className
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted ">
        {image ? (
          <Image
            src={image}
            alt={label}
            fill
            sizes="(max-width: 640px) 5.5rem, 8rem"
            className="object-contain p-1"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-muted/60"
            aria-hidden
          >
            <span className="text-[0.625rem] font-medium text-muted-foreground">
              Image
            </span>
          </div>
        )}
      </div>
      <p className="w-full text-center text-[0.8125rem] font-bold leading-tight text-foreground">
        {label}
      </p>
    </div>
  )
}
