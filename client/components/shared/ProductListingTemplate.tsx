"use client";

import React, { useState } from "react";
import Image from "next/image";
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

// Mock Data
const MOCK_PRODUCTS = [
  {
    id: "1",
    title: "Google Pixel 9a 5G (8GB RAM, 256GB, Obsidian)",
    rating: "4.4",
    reviews: "16",
    price: 39999,
    originalPrice: 49999,
    discount: "20% Off",
    savings: "₹10,000",
    image: "https://via.placeholder.com/300x400/1e293b/ffffff?text=Pixel+9a",
    deliveryDate: "Thur, 26th Mar",
    extraDiscount: "Extra discount of Rs. 3000",
  },
  {
    id: "2",
    title: "Google Pixel 9a 5G (8GB RAM, 256GB, Porcelain)",
    rating: "4.6",
    reviews: "13",
    price: 39999,
    originalPrice: 49999,
    discount: "20% Off",
    savings: "₹10,000",
    image: "https://via.placeholder.com/300x400/334155/ffffff?text=Pixel+9a",
    deliveryDate: "Fri, 27th Mar",
  },
  {
    id: "3",
    title: "oppo K14x 5G (6GB RAM, 128GB, Icy Blue)",
    rating: "4.1",
    reviews: "42",
    price: 16999,
    originalPrice: 19999,
    discount: "15% Off",
    savings: "₹3,000",
    image: "https://via.placeholder.com/300x400/0f172a/ffffff?text=Oppo+K14x",
    deliveryDate: "Fri, 27th Mar",
  },
  {
    id: "4",
    title: "Croma 80 cm (32 inch) HD LED Google TV 5.0",
    rating: "4.3",
    reviews: "22",
    price: 10000,
    originalPrice: 12500,
    discount: "20% Off",
    savings: "₹2,500",
    image: "https://via.placeholder.com/400x300/1e293b/ffffff?text=Croma+TV+32",
    deliveryDate: "Wed, 25th Mar",
  },
  {
    id: "5",
    title: "Croma 109 cm (43 inch) QLED 4K Ultra HD Smart TV",
    rating: "3.7",
    reviews: "29",
    price: 20490,
    originalPrice: 28500,
    discount: "28% Off",
    savings: "₹8,010",
    image: "https://via.placeholder.com/400x300/334155/ffffff?text=Croma+TV+43",
    deliveryDate: "Tue, 24th Mar",
  },
  {
    id: "6",
    title: "Croma 80cm (32inch) HD Ready LED TV with A Plus Panel",
    rating: "5.0",
    reviews: "4",
    price: 7690,
    originalPrice: 10000,
    discount: "23% Off",
    savings: "₹2,310",
    image: "https://via.placeholder.com/400x300/0f172a/ffffff?text=Croma+TV+Basic",
    deliveryDate: "Mon, 23rd Mar",
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
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            {categoryTitle}
          </p>
          <h1 className="text-3xl font-black text-foreground flex items-baseline gap-2">
            {categoryTitle} <span className="text-sm font-medium text-muted-foreground">(5079)</span>
          </h1>
        </div>

        {/* Filters and Sort Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Interactive Filter Dropdowns */}
            {[
              { name: "Categories", options: ["Televisions", "Smartphones", "Audio", "Laptops"] },
              { name: "Brand", options: ["Sony", "Samsung", "Apple", "Google", "Oppo"] },
              { name: "Price", options: ["Under ₹10,000", "₹10,000 - ₹20,000", "Above ₹20,000"] },
              { name: "Processor/Size", options: ["Snapdragon", "A15 Bionic", "32 Inch", "43 Inch", "55 Inch"] },
              { name: "RAM/Mode", options: ["4GB", "6GB", "8GB", "16GB", "Standard"] }
            ].map((filter) => (
              <DropdownMenu key={filter.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full bg-card hover:bg-muted text-card-foreground border-border/50 h-9 font-medium"
                  >
                    {filter.name} <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="ml-1 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-card border-border/50 p-2 rounded-xl">
                  {filter.options.map((opt) => (
                    <DropdownMenuItem
                      key={opt}
                      className="cursor-pointer rounded-md px-3 py-2 text-sm text-card-foreground hover:bg-muted"
                    >
                      {opt}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}

            {/* All Filters Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full bg-card hover:bg-muted text-card-foreground border-border/50 h-9 font-medium"
                >
                  All Filters <HugeiconsIcon icon={FilterHorizontalIcon} size={16} className="ml-1 opacity-70" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[350px] sm:w-[450px] bg-background p-0 border-l border-border/50 flex flex-col">
                <SheetHeader className="p-6 border-b border-border/50">
                  <SheetTitle className="text-xl font-bold">All Filters</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-auto p-6">
                  <h3 className="font-semibold text-sm mb-4">Categories</h3>
                  <div className="flex flex-col gap-4">
                    {MOCK_CATEGORIES.map((cat) => (
                      <div key={cat} className="flex items-center space-x-3">
                        <Checkbox id={cat} className="rounded-[4px] border-muted-foreground" />
                        <label
                          htmlFor={cat}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
                        >
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 border-t border-border/50 flex gap-4 bg-background">
                  <Button variant="outline" className="flex-1 rounded-sm border-border">Clear All</Button>
                  <Button className="flex-1 rounded-sm bg-[#00dfb2] hover:bg-[#00c9a0] text-black font-bold border-none">Apply</Button>
                </div>
              </SheetContent>
            </Sheet>

          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-foreground">Sort By</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 font-bold px-2 hover:bg-transparent">
                  {sortOption} <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border/50 p-2 rounded-xl">
                {SORT_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt}
                    onClick={() => setSortOption(opt)}
                    className={`cursor-pointer rounded-lg px-4 py-2 text-sm ${
                      sortOption === opt ? "text-[#00dfb2] font-semibold bg-primary/10" : "text-card-foreground hover:bg-muted"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PRODUCTS.map((prod) => (
            <div key={prod.id} className="flex flex-col group cursor-pointer">
              
              {/* Product Card / Image Block */}
              <div className="relative bg-card rounded-2xl p-6 flex flex-col items-center justify-center aspect-[4/3] sm:aspect-square overflow-hidden mb-4 border border-border/50 group-hover:border-primary/30 transition-colors">
                {/* Actions (Like & Compare) */}
                <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
                   <button className="w-8 h-8 rounded-full bg-background/50 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors">
                     <HugeiconsIcon icon={FavouriteIcon} size={16} className="text-foreground opacity-80" />
                   </button>
                   <div className="flex items-center gap-1.5 bg-background/50 backdrop-blur-sm border border-border px-2.5 py-1.5 rounded-full hover:bg-background transition-colors">
                     <Checkbox id={`cmp-${prod.id}`} className="rounded-[4px] w-3.5 h-3.5 border-foreground/50" />
                     <label htmlFor={`cmp-${prod.id}`} className="text-xs font-semibold cursor-pointer text-foreground">Compare</label>
                   </div>
                </div>

                {/* Product Image */}
                <div className="w-full h-full relative p-4 transition-transform duration-500 group-hover:scale-105">
                   <img src={prod.image} alt={prod.title} className="w-full h-full object-contain" />
                </div> 
              </div>

              {/* Product Info */}
              <div className="flex flex-col px-1">
                <h3 className="text-base font-bold text-foreground leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {prod.title}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-[#00dfb2] font-bold text-sm tracking-wide">{prod.rating}</span>
                  <HugeiconsIcon icon={StarIcon} size={14} className="fill-[#00dfb2] text-[#00dfb2]" />
                  <span className="text-muted-foreground text-sm">({prod.reviews})</span>
                </div>

                {/* Prices */}
                <div className="flex items-center flex-wrap gap-2 mb-4">
                  <span className="text-xl font-black text-foreground">
                    ₹{prod.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground line-through decoration-muted-foreground/50">
                    ₹{prod.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground ml-1">
                    (Save {prod.savings})
                  </span>
                  <span className="text-xs font-bold bg-foreground text-background px-2 py-0.5 rounded-sm ml-1">
                    {prod.discount}
                  </span>
                </div>

                {/* Delivery & Badges */}
                <div className="flex items-center gap-2 mb-3">
                   <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                     ★ Standard Delivery by {prod.deliveryDate}
                   </div>
                </div>
                {prod.extraDiscount && (
                   <div className="inline-flex">
                     <span className="text-xs font-bold text-[#00dfb2] bg-[#00dfb2]/10 border border-[#00dfb2]/20 px-3 py-1.5 rounded-full">
                       {prod.extraDiscount}
                     </span>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="flex justify-center mt-12 mb-16">
          <Button variant="outline" className="rounded-full px-8 py-6 text-sm font-semibold bg-transparent border-border/80 hover:bg-muted text-foreground transition-all">
            View More
          </Button>
        </div>

        {/* SEO Description Area */}
        <div className="max-w-4xl mx-auto border-t border-border/50 pt-12 text-left mb-12">
           <h2 className="text-2xl font-black text-foreground mb-6">The best {categoryTitle} to keep you updated at all times</h2>
           <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
             For a lot of us, a device is our communication tool, our audio-video player, our navigation tool, and our web browser, among others. And not-so-surprisingly, there's very little that your {categoryTitle} cannot do. It has tread beyond its conventional use, with even the entry-level models today capable of performing several tasks at once. It has also gone from being a chunky, tough-buttoned device to a sleek, user-friendly, feather-touch reality today. 
           </p>
           <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
             For the health-conscious, coupling these with a smart wearable is an excellent way to keep a tab on your well-being. With technology pacing forward, it can become challenging to keep up with the various features it brings to our table. But if you're unsure where to begin your research, it is best to start with what matters the most for your usage.
           </p>
        </div>

      </div>
    </div>
  );
}
