import Image from "next/image"
import type { StaticImageData } from "next/image"
import { cn } from "@/lib/utils"

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
    primary: "YES BANK",
    offer: "Get 10% Instant Discount upto Rs.3,000 on YES Bank Credit Card EMI",
  },
  {
    id: "2",
    primary: "BOBCARD",
    offer: "Get 10% Instant Discount upto Rs.3,000 on BOB Card EMI",
  },
  {
    id: "3",
    primary: "DBS",
    offer: "Get 10% Instant Discount upto Rs.3,000 on DBS Bank Credit Card EMI",
  },
  {
    id: "4",
    primary: "HDFC",
    offer: "Extra 5% cashback on select HDFC Debit & Credit Cards",
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
        "flex h-19 w-[min(100%,22rem)] shrink-0 overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-sm sm:w-88",
        className
      )}
    >
      <div className="flex w-22 shrink-0 items-center justify-center border-r border-border bg-muted/30 px-2">
        {logo ? (
          <Image
            src={logo}
            alt={primary}
            width={88}
            height={40}
            className="max-h-10 w-auto object-contain"
          />
        ) : (
          <span className="text-center text-[0.65rem] font-bold uppercase leading-tight tracking-tight text-foreground">
            {primary}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-3 py-2">
        <p className="text-[0.8125rem] font-semibold leading-snug text-foreground">
          {offer}
        </p>
        <p className="text-[0.65rem] text-muted-foreground">*T&amp;C apply</p>
      </div>
    </div>
  )
}

type OfferCardsProps = {
  offers?: OfferCardItem[]
  className?: string
}

const OfferCards = ({ offers = defaultOffers, className }: OfferCardsProps) => {
  return (
    <section
      className={cn("w-full max-w-7xl overflow-hidden py-6", className)}
      aria-label="Bank and card offers"
    >
      <div className="group relative w-full">
        <div
          className={cn(
            "flex w-max max-w-none animate-offer-marquee motion-reduce:animate-none",
            "group-hover:paused"
          )}
        >
          {[0, 1].map((set) => (
            <div
              key={set}
              className="flex shrink-0 gap-3 pr-3"
              aria-hidden={set === 1 ? true : undefined}
            >
              {offers.map((item) => (
                <OfferCard
                  key={`${set}-${item.id}`}
                  primary={item.primary}
                  logo={item.logo}
                  offer={item.offer}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OfferCards
