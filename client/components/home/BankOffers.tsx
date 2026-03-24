"use client"

import * as React from "react"
import Image from "next/image"
import type { StaticImageData } from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

export type OfferCardItem = {
  id: string
  primary: string
  /** Optional logo; when omitted, primary text is shown in the logo panel */
  logo?: StaticImageData | string
  offer: string
}

const defaultOffers: OfferCardItem[] = [
  {
    id: "1",
    primary: "HSBC",
    logo: "/assets/extracted/HSBC_uTJdfLn1f.png",
    offer: "Get 10% Instant Discount upto Rs.7,500 on HSBC Credit Card EMI transactions",
  },
  {
    id: "2",
    primary: "BOBCARD",
    offer: "Get 10% Instant Discount upto Rs.5,000 on BOBCARD Credit Card EMI transactions",
  },
  {
    id: "3",
    primary: "MobiKwik",
    logo: "/assets/extracted/mobikwik_t33x9lYsK.png",
    offer: "Get Flat Rs.200 Cashback on MobiKwik Wallet transaction of Rs.3,000 and above",
  },
  {
    id: "4",
    primary: "HDFC",
    offer: "Get 10% Instant Discount upto Rs.3,000 on HDFC Bank Credit Card EMI",
  },
  {
    id: "5",
    primary: "ICICI",
    offer: "Get 10% Instant Discount upto Rs.2,500 on ICICI Bank Credit Card EMI",
  },
  {
    id: "6",
    primary: "SBI",
    offer: "Get 7.5% Instant Discount upto Rs.3,000 on SBI Credit Card EMI transactions",
  },
]

function OfferCard({
  primary,
  logo,
  offer,
  className,
}: Omit<OfferCardItem, "id"> & { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-24 w-[min(100%,22rem)] shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm sm:w-80",
        className
      )}
    >
      {/* Logo / bank name area */}
      <div className="flex w-24 shrink-0 items-center justify-center border-r border-neutral-200 bg-neutral-50 px-2">
        {logo ? (
          <Image
            src={logo}
            alt={primary}
            width={88}
            height={44}
            className="max-h-11 w-auto object-contain"
          />
        ) : (
          <span className="text-center text-[0.7rem] font-bold uppercase leading-tight tracking-tight text-neutral-700">
            {primary}
          </span>
        )}
      </div>

      {/* Offer text */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-3 py-2.5">
        <p className="line-clamp-3 text-[0.8rem] font-medium leading-snug text-neutral-800">
          {offer}
        </p>
        <p className="text-[0.6rem] text-neutral-400">*T&C apply</p>
      </div>
    </div>
  )
}

type OfferCardsProps = {
  offers?: OfferCardItem[]
  className?: string
}

const OfferCards = ({ offers = defaultOffers, className }: OfferCardsProps) => {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = React.useState(false)
  const [canNext, setCanNext] = React.useState(false)

  const updateScroll = React.useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const maxScroll = scrollWidth - clientWidth
    setCanPrev(scrollLeft > 0.5)
    setCanNext(scrollLeft < maxScroll - 0.5)
  }, [])

  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateScroll()
    el.addEventListener("scroll", updateScroll, { passive: true })
    const ro = new ResizeObserver(updateScroll)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", updateScroll)
      ro.disconnect()
    }
  }, [updateScroll])

  const scroll = React.useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: el.clientWidth * 0.7 * dir, behavior: "smooth" })
  }, [])

  return (
    <section
      className={cn("w-full bg-white py-6", className)}
      aria-label="Bank and card offers"
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">
            Exciting Bank Offers For You
          </h2>
          <div className="flex shrink-0 gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full text-neutral-400 hover:text-neutral-700"
              aria-label="Scroll offers left"
              disabled={!canPrev}
              onClick={() => scroll(-1)}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full text-neutral-400 hover:text-neutral-700"
              aria-label="Scroll offers right"
              disabled={!canNext}
              onClick={() => scroll(1)}
            >
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            </Button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="scrollbar-none flex gap-3 overflow-x-auto pb-1"
        >
          {offers.map((item) => (
            <OfferCard
              key={item.id}
              primary={item.primary}
              logo={item.logo}
              offer={item.offer}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default OfferCards
