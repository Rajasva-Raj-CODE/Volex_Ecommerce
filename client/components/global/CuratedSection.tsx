"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export type CuratedCard = {
  id: string
  imageSrc: string
  imageAlt: string
  href?: string
}

export type CuratedTab = {
  id: string
  label: string
  icon?: string
  items: CuratedCard[]
}

const defaultTabs: CuratedTab[] = [
  {
    id: "collections",
    label: "VolteX Collections",
    items: [
      {
        id: "c1",
        imageSrc: "/assets/extracted/Croma_Collections_aer8cq.png",
        imageAlt: "Croma Collections",
      },
      {
        id: "c2",
        imageSrc: "/assets/extracted/Indulge_rve6v9.png",
        imageAlt: "Indulge",
      },
      {
        id: "c3",
        imageSrc: "/assets/extracted/1Gift_dflts4.png",
        imageAlt: "Gift Store",
      },
    ],
  },
  {
    id: "deals-week",
    label: "Deals of the Week",
    items: [
      {
        id: "dw1",
        imageSrc: "/assets/extracted/Deals_of_the_week_-_Desktop_cdvjjx.png",
        imageAlt: "Deals of the Week",
      },
    ],
  },
  {
    id: "blogs",
    label: "Blogs",
    items: [
      {
        id: "b1",
        imageSrc: "/assets/extracted/HP_Blog_1_17Sept2025_ANAI_bY8UC.png",
        imageAlt: "Blog 1",
      },
      {
        id: "b2",
        imageSrc: "/assets/extracted/HP_Blog_2_17Sept2025_vFQ1Vcmux8.png",
        imageAlt: "Blog 2",
      },
      {
        id: "b3",
        imageSrc: "/assets/extracted/HP_Blog_3_17Sept2025_zbJUe4oSeU.png",
        imageAlt: "Blog 3",
      },
      {
        id: "b4",
        imageSrc: "/assets/extracted/HP_Blog_4_17Sept2025_uMyVgCeJ5w.png",
        imageAlt: "Blog 4",
      },
    ],
  },
  {
    id: "sustainability",
    label: "Sustainability",
    items: [
      {
        id: "s1",
        imageSrc: "/assets/extracted/HP_Sustainability_Regular_27Oct2025_kgAHAmU3z.png",
        imageAlt: "Sustainability",
      },
    ],
  },
]

type CuratedSectionProps = {
  title?: string
  tabs?: CuratedTab[]
  className?: string
}

export default function CuratedSection({
  title = "Exclusively Curated For You",
  tabs = defaultTabs,
  className,
}: CuratedSectionProps) {
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.id ?? "")

  const activeItems = React.useMemo(
    () => tabs.find((t) => t.id === activeTab)?.items ?? [],
    [tabs, activeTab]
  )

  return (
    <section
      className={cn("w-full bg-[#0f0f0f] py-8", className)}
      aria-label={title}
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <h2 className="mb-5 text-lg font-bold text-white">{title}</h2>

        {/* Icon Tabs */}
        <div
          className="scrollbar-none mb-5 flex gap-4 overflow-x-auto pb-1"
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex shrink-0 flex-col items-center gap-2 rounded-xl px-4 py-3 transition-colors min-w-[90px]",
                  isActive
                    ? "bg-[#49A5A2]/15 text-[#49A5A2]"
                    : "text-white/50 hover:text-white/70"
                )}
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg",
                    isActive ? "bg-[#49A5A2]/20" : "bg-white/5"
                  )}
                >
                  <span className="text-lg">
                    {tab.id === "collections" && "🏷️"}
                    {tab.id === "deals-week" && "🔥"}
                    {tab.id === "blogs" && "📝"}
                    {tab.id === "sustainability" && "🌱"}
                  </span>
                </div>
                <span className="text-[0.65rem] font-medium leading-tight text-center">
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Cards - 2-column grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeItems.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-xl aspect-[2163/1050]"
            >
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {activeItems.length === 0 && (
          <p className="py-12 text-center text-sm text-white/40">
            No items available in this category yet.
          </p>
        )}
      </div>
    </section>
  )
}
