"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { generateProductSlug } from "@/lib/product-data";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  FavouriteIcon,
  FilterHorizontalIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";

// Mock Data — 9 products with extracted images
const MOCK_PRODUCTS = [
  {
    id: "1",
    title: "Croma 80 cm (32 inch) HD Ready LED TV with A+ Panel",
    rating: "4.3",
    reviews: "22",
    price: 9990,
    originalPrice: 19000,
    discount: "47% Off",
    savings: "₹9,010",
    image: "/assets/extracted/TV_vdemgc.png",
    deliveryDate: "Tomorrow",
  },
  {
    id: "2",
    title: "Croma 5.1 Channel 340W Dolby Digital Soundbar with Subwoofer",
    rating: "4.1",
    reviews: "16",
    price: 10990,
    originalPrice: 18000,
    discount: "39% Off",
    savings: "₹7,010",
    image: "/assets/extracted/Home_theatres_kpwvft.png",
    deliveryDate: "Thur, 27th Mar",
    extraDiscount: "Extra discount of Rs. 2000",
  },
  {
    id: "3",
    title: "Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB, Titanium Black)",
    rating: "4.6",
    reviews: "38",
    price: 69999,
    originalPrice: 134999,
    discount: "48% Off",
    savings: "₹65,000",
    image: "/assets/extracted/Mobile_sdtrdf.png",
    deliveryDate: "Fri, 28th Mar",
  },
  {
    id: "4",
    title: "Apple MacBook Air 13 inch M3 Chip (8GB RAM, 256GB SSD, Midnight)",
    rating: "4.8",
    reviews: "29",
    price: 89990,
    originalPrice: 114900,
    discount: "22% Off",
    savings: "₹24,910",
    image: "/assets/extracted/Laptops_pzewpv.png",
    deliveryDate: "Tue, 25th Mar",
    extraDiscount: "Extra discount of Rs. 5000",
  },
  {
    id: "5",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)",
    rating: "4.5",
    reviews: "64",
    price: 22990,
    originalPrice: 34990,
    discount: "34% Off",
    savings: "₹12,000",
    image: "/assets/extracted/Head_set_xjj934.png",
    deliveryDate: "Wed, 26th Mar",
  },
  {
    id: "6",
    title: "Canon EOS R50 Mirrorless Camera with RF-S 18-45mm Lens Kit",
    rating: "4.7",
    reviews: "12",
    price: 62990,
    originalPrice: 79995,
    discount: "21% Off",
    savings: "₹17,005",
    image: "/assets/extracted/Cameras_a6n2jy.png",
    deliveryDate: "Fri, 28th Mar",
  },
  {
    id: "7",
    title: "Apple iPad Air 11 inch M2 Chip (128GB, Wi-Fi, Space Grey)",
    rating: "4.4",
    reviews: "19",
    price: 49900,
    originalPrice: 69900,
    discount: "29% Off",
    savings: "₹20,000",
    image: "/assets/extracted/Tablets_yzod4f.png",
    deliveryDate: "Mon, 31st Mar",
  },
  {
    id: "8",
    title: "JBL Flip 6 Portable Bluetooth Speaker with IP67 Waterproof",
    rating: "4.3",
    reviews: "45",
    price: 8999,
    originalPrice: 14999,
    discount: "40% Off",
    savings: "₹6,000",
    image: "/assets/extracted/Speaker_g2mbgn.png",
    deliveryDate: "Tomorrow",
    extraDiscount: "Extra discount of Rs. 1000",
  },
  {
    id: "9",
    title: "Apple Watch Series 9 GPS 45mm Aluminium Case (Midnight)",
    rating: "4.6",
    reviews: "33",
    price: 36900,
    originalPrice: 49900,
    discount: "26% Off",
    savings: "₹13,000",
    image: "/assets/extracted/Wearables_iunu7h.png",
    deliveryDate: "Thur, 27th Mar",
  },
];

const MOCK_CATEGORIES = [
  "Android Phones (1299)",
  "Mobile Cover & Cases (1138)",
  "Smartwatch Straps (481)",
  "Truly Wireless Earbuds (463)",
  "Smart Watches (272)",
  "Smart Rings (172)",
  "Mobile Screen Protectors (171)",
  "Bluetooth Headphones (156)",
  "USB Cables (150)",
  "Power Banks (138)",
  "iPhones (124)",
];

const SORT_OPTIONS = [
  "Price (Lowest First)",
  "Price (Highest First)",
  "Discount (Descending)",
  "Relevancy",
  "Latest Arrival",
  "Top Rated",
  "Featured",
];

interface ProductListingTemplateProps {
  categoryTitle: string;
}

export default function ProductListingTemplate({ categoryTitle }: ProductListingTemplateProps) {
  const [sortOption, setSortOption] = useState("Relevancy");

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pb-20">
      <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 lg:px-8">

        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <p className="mb-1 text-xs font-semibold text-[#49A5A2]">
            Home &gt; {categoryTitle}
          </p>
          <h1 className="flex items-baseline gap-2 text-3xl font-black text-white">
            {categoryTitle}{" "}
            <span className="text-sm font-medium text-white/50">(486)</span>
          </h1>
        </div>

        {/* Filter & Sort Row */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">

            {/* Filter Pills */}
            {[
              { name: "Categories", options: ["Televisions", "Smartphones", "Audio", "Laptops"] },
              { name: "Brand", options: ["Croma", "Samsung", "LG", "Sony", "Hisense"] },
              { name: "Price", options: ["Under ₹10,000", "₹10,000 - ₹25,000", "₹25,000 - ₹50,000", "Above ₹50,000"] },
              { name: "Screen Size (In Inches)", options: ["32 Inch", "43 Inch", "50 Inch", "55 Inch", "65 Inch"] },
              { name: "Delivery Mode", options: ["Standard", "Express", "Same Day"] },
            ].map((filter) => (
              <DropdownMenu key={filter.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 rounded-md border-white/20 bg-[#1a1a1a] font-medium text-white hover:bg-[#252525] hover:text-white"
                  >
                    {filter.name}{" "}
                    <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="ml-1 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-52 rounded-xl border-white/10 bg-[#1a1a1a] p-2"
                >
                  {filter.options.map((opt) => (
                    <DropdownMenuItem
                      key={opt}
                      className="cursor-pointer rounded-md px-3 py-2 text-sm text-white hover:bg-[#252525]"
                    >
                      {opt}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}

            {/* All Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 rounded-md border-white/20 bg-[#1a1a1a] font-medium text-white hover:bg-[#252525] hover:text-white"
                >
                  All Filters{" "}
                  <HugeiconsIcon icon={FilterHorizontalIcon} size={16} className="ml-1 opacity-70" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-[350px] flex-col border-l border-white/10 bg-[#0f0f0f] p-0 text-white sm:w-[450px]"
              >
                <SheetHeader className="border-b border-white/10 p-6">
                  <SheetTitle className="text-xl font-bold text-white">All Filters</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-auto p-6">
                  <h3 className="mb-4 text-sm font-semibold text-white">Categories</h3>
                  <div className="flex flex-col gap-4">
                    {MOCK_CATEGORIES.map((cat) => (
                      <div key={cat} className="flex items-center space-x-3">
                        <Checkbox
                          id={cat}
                          className="rounded-[4px] border-white/40 data-[state=checked]:border-[#49A5A2] data-[state=checked]:bg-[#49A5A2]"
                        />
                        <label
                          htmlFor={cat}
                          className="text-sm font-medium leading-none text-white/80"
                        >
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 border-t border-white/10 bg-[#0f0f0f] p-6">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-sm border-white/20 bg-transparent text-white hover:bg-[#1a1a1a] hover:text-white"
                  >
                    Clear All
                  </Button>
                  <Button className="flex-1 rounded-sm border-none bg-[#49A5A2] font-bold text-black hover:bg-[#3d8e8b]">
                    Apply
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Sort */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-white/70">Sort By</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 px-2 font-bold text-white hover:bg-transparent hover:text-white"
                >
                  {sortOption}{" "}
                  <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl border-white/10 bg-[#1a1a1a] p-2"
              >
                {SORT_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt}
                    onClick={() => setSortOption(opt)}
                    className={`cursor-pointer rounded-lg px-4 py-2 text-sm ${
                      sortOption === opt
                        ? "bg-[#49A5A2]/10 font-semibold text-[#49A5A2]"
                        : "text-white hover:bg-[#252525]"
                    }`}
                  >
                    {opt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PRODUCTS.map((prod) => (
            <Link key={prod.id} href={`/product/${generateProductSlug(prod.title)}`} className="group flex flex-col">

              {/* Image Card */}
              <div className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 transition-colors group-hover:border-[#49A5A2]/30 sm:aspect-[4/3]">
                {/* Heart & Compare */}
                <div className="absolute right-4 top-4 z-10 flex items-center gap-3">
                  <button className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-sm transition-colors hover:bg-black/80">
                    <HugeiconsIcon icon={FavouriteIcon} size={16} className="text-white/80" />
                  </button>
                  <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2.5 py-1.5 backdrop-blur-sm transition-colors hover:bg-black/80">
                    <Checkbox
                      id={`cmp-${prod.id}`}
                      className="h-3.5 w-3.5 rounded-[4px] border-white/50 data-[state=checked]:border-[#49A5A2] data-[state=checked]:bg-[#49A5A2]"
                    />
                    <label
                      htmlFor={`cmp-${prod.id}`}
                      className="cursor-pointer text-xs font-semibold text-white"
                    >
                      Compare
                    </label>
                  </div>
                </div>

                {/* Product Image */}
                <div className="relative h-full w-full p-4 transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={prod.image}
                    alt={prod.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col px-1">
                <h3 className="mb-2 line-clamp-2 text-base font-bold leading-tight text-white transition-colors group-hover:text-[#49A5A2]">
                  {prod.title}
                </h3>

                {/* Rating */}
                <div className="mb-3 flex items-center gap-1">
                  <span className="text-sm font-bold tracking-wide text-[#49A5A2]">
                    {prod.rating}
                  </span>
                  <HugeiconsIcon
                    icon={StarIcon}
                    size={14}
                    className="fill-[#49A5A2] text-[#49A5A2]"
                  />
                  <span className="text-sm text-white/50">({prod.reviews})</span>
                </div>

                {/* Prices */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="text-xl font-black text-white">
                    ₹{prod.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm font-semibold text-white/40 line-through">
                    ₹{prod.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="ml-1 text-[11px] font-medium text-white/50">
                    (Save {prod.savings})
                  </span>
                  <span className="ml-1 rounded-sm bg-white px-2 py-0.5 text-xs font-bold text-black">
                    {prod.discount}
                  </span>
                </div>

                {/* Delivery */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs font-medium text-white/70">
                    🚚 Standard Delivery by {prod.deliveryDate}
                  </span>
                </div>

                {/* Extra Discount Badge */}
                {prod.extraDiscount && (
                  <div className="inline-flex">
                    <span className="rounded-full border border-[#49A5A2]/20 bg-[#49A5A2]/10 px-3 py-1.5 text-xs font-bold text-[#49A5A2]">
                      {prod.extraDiscount}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* View More */}
        <div className="mb-16 mt-12 flex justify-center">
          <Button
            variant="outline"
            className="rounded-full border-white/20 bg-transparent px-8 py-6 text-sm font-semibold text-white transition-all hover:bg-[#1a1a1a] hover:text-white"
          >
            View More
          </Button>
        </div>

        {/* SEO Section */}
        <div className="mx-auto mb-12 max-w-4xl border-t border-white/10 pt-12 text-left">
          <h2 className="mb-6 text-2xl font-black text-white">
            The best {categoryTitle} to keep you updated at all times
          </h2>
          <p className="mb-6 text-sm font-medium leading-relaxed text-white/50">
            For a lot of us, a device is our communication tool, our audio-video player, our
            navigation tool, and our web browser, among others. And not-so-surprisingly, there&apos;s
            very little that your {categoryTitle} cannot do. It has tread beyond its conventional use,
            with even the entry-level models today capable of performing several tasks at once. It has
            also gone from being a chunky, tough-buttoned device to a sleek, user-friendly,
            feather-touch reality today.
          </p>
          <p className="mb-6 text-sm font-medium leading-relaxed text-white/50">
            For the health-conscious, coupling these with a smart wearable is an excellent way to keep
            a tab on your well-being. With technology pacing forward, it can become challenging to keep
            up with the various features it brings to our table. But if you&apos;re unsure where to
            begin your research, it is best to start with what matters the most for your usage.
          </p>

          <h2 className="mb-4 mt-10 text-xl font-bold text-white">
            Things to consider before buying {categoryTitle}
          </h2>
          <p className="mb-6 text-sm font-medium leading-relaxed text-white/50">
            Before making a purchase, consider the screen size and resolution that best fits your
            space. A 32-inch TV is great for bedrooms while a 55-inch or above suits living rooms. For
            picture quality, look for 4K UHD or QLED panels. Smart TV features like built-in apps,
            voice assistants, and casting support add convenience. Don&apos;t forget to compare audio
            quality — Dolby Audio and DTS support make a noticeable difference.
          </p>

          <h2 className="mb-4 mt-10 text-xl font-bold text-white">
            Top brands for {categoryTitle}
          </h2>
          <p className="text-sm font-medium leading-relaxed text-white/50">
            Leading brands like Samsung, LG, Sony, and Croma offer a wide range of options to suit
            every budget. Samsung&apos;s Crystal 4K series delivers vibrant visuals, while LG&apos;s
            OLED lineup is unmatched in contrast and colour accuracy. Sony&apos;s TRILUMINOS display
            technology brings lifelike colours, and Croma&apos;s own range offers exceptional value
            with features that rival premium brands at a fraction of the price.
          </p>
        </div>
      </div>
    </div>
  );
}
