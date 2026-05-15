"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  FavouriteIcon,
  FilterHorizontalIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { listProducts, listCategoriesFlat } from "@/lib/catalog-api";

interface DisplayProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: string;
  savings: string;
  image: string | null;
  isLocalImage: boolean;
  rating: string;
  reviews: string;
  deliveryDate: string;
  extraDiscount?: string;
  stock: number;
}

// Hardcoded editorial/featured products (shown when no real category is matched)
const MOCK_PRODUCTS: DisplayProduct[] = [
  { id: "1", slug: "croma-32-led-tv", title: "Croma 80 cm (32 inch) HD Ready LED TV with A+ Panel", rating: "4.3", reviews: "22", price: 9990, originalPrice: 19000, discount: "47% Off", savings: "₹9,010", image: "/assets/extracted/TV_vdemgc.png", isLocalImage: true, deliveryDate: "Tomorrow", stock: 10 },
  { id: "2", slug: "croma-soundbar-340w", title: "Croma 5.1 Channel 340W Dolby Digital Soundbar with Subwoofer", rating: "4.1", reviews: "16", price: 10990, originalPrice: 18000, discount: "39% Off", savings: "₹7,010", image: "/assets/extracted/Home_theatres_kpwvft.png", isLocalImage: true, deliveryDate: "Thur, 27th Mar", extraDiscount: "Extra discount of Rs. 2000", stock: 10 },
  { id: "3", slug: "samsung-galaxy-s24-ultra", title: "Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB, Titanium Black)", rating: "4.6", reviews: "38", price: 69999, originalPrice: 134999, discount: "48% Off", savings: "₹65,000", image: "/assets/extracted/Mobile_sdtrdf.png", isLocalImage: true, deliveryDate: "Fri, 28th Mar", stock: 10 },
  { id: "4", slug: "apple-macbook-air-m3", title: "Apple MacBook Air 13 inch M3 Chip (8GB RAM, 256GB SSD, Midnight)", rating: "4.8", reviews: "29", price: 89990, originalPrice: 114900, discount: "22% Off", savings: "₹24,910", image: "/assets/extracted/Laptops_pzewpv.png", isLocalImage: true, deliveryDate: "Tue, 25th Mar", extraDiscount: "Extra discount of Rs. 5000", stock: 10 },
  { id: "5", slug: "sony-wh-1000xm5", title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)", rating: "4.5", reviews: "64", price: 22990, originalPrice: 34990, discount: "34% Off", savings: "₹12,000", image: "/assets/extracted/Head_set_xjj934.png", isLocalImage: true, deliveryDate: "Wed, 26th Mar", stock: 10 },
  { id: "6", slug: "canon-eos-r50", title: "Canon EOS R50 Mirrorless Camera with RF-S 18-45mm Lens Kit", rating: "4.7", reviews: "12", price: 62990, originalPrice: 79995, discount: "21% Off", savings: "₹17,005", image: "/assets/extracted/Cameras_a6n2jy.png", isLocalImage: true, deliveryDate: "Fri, 28th Mar", stock: 10 },
  { id: "7", slug: "apple-ipad-air-m2", title: "Apple iPad Air 11 inch M2 Chip (128GB, Wi-Fi, Space Grey)", rating: "4.4", reviews: "19", price: 49900, originalPrice: 69900, discount: "29% Off", savings: "₹20,000", image: "/assets/extracted/Tablets_yzod4f.png", isLocalImage: true, deliveryDate: "Mon, 31st Mar", stock: 10 },
  { id: "8", slug: "jbl-flip-6", title: "JBL Flip 6 Portable Bluetooth Speaker with IP67 Waterproof", rating: "4.3", reviews: "45", price: 8999, originalPrice: 14999, discount: "40% Off", savings: "₹6,000", image: "/assets/extracted/Speaker_g2mbgn.png", isLocalImage: true, deliveryDate: "Tomorrow", extraDiscount: "Extra discount of Rs. 1000", stock: 10 },
  { id: "9", slug: "apple-watch-series-9", title: "Apple Watch Series 9 GPS 45mm Aluminium Case (Midnight)", rating: "4.6", reviews: "33", price: 36900, originalPrice: 49900, discount: "26% Off", savings: "₹13,000", image: "/assets/extracted/Wearables_iunu7h.png", isLocalImage: true, deliveryDate: "Thur, 27th Mar", stock: 10 },
];

const SORT_OPTIONS = [
  "Price (Lowest First)",
  "Price (Highest First)",
  "Discount (Descending)",
  "Relevancy",
  "Latest Arrival",
];

const API_SORT_MAP: Record<string, { sortBy: string; sortOrder: string }> = {
  "Price (Lowest First)":  { sortBy: "price", sortOrder: "asc" },
  "Price (Highest First)": { sortBy: "price", sortOrder: "desc" },
  "Latest Arrival":        { sortBy: "createdAt", sortOrder: "desc" },
  "Relevancy":             { sortBy: "createdAt", sortOrder: "desc" },
  "Discount (Descending)": { sortBy: "price", sortOrder: "asc" },
};

interface ProductListingTemplateProps {
  categoryTitle: string;
  categorySlug?: string;
  searchQuery?: string;
}

const BRAND_OPTIONS = ["Apple", "Samsung", "Sony", "JBL", "Canon", "LG", "Dell", "HP"];
const PRICE_OPTIONS = [
  { label: "Under ₹10,000", minPrice: undefined, maxPrice: 10000 },
  { label: "₹10,000 - ₹25,000", minPrice: 10000, maxPrice: 25000 },
  { label: "₹25,000 - ₹50,000", minPrice: 25000, maxPrice: 50000 },
  { label: "Above ₹50,000", minPrice: 50000, maxPrice: undefined },
];
const PAGE_SIZE = 20;

export default function ProductListingTemplate({ categoryTitle, categorySlug, searchQuery }: ProductListingTemplateProps) {
  const [sortOption, setSortOption] = useState("Relevancy");
  const [products, setProducts] = useState<DisplayProduct[]>(MOCK_PRODUCTS);
  const [total, setTotal] = useState(MOCK_PRODUCTS.length);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [brand, setBrand] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<(typeof PRICE_OPTIONS)[number] | undefined>();
  const [availability, setAvailability] = useState<"all" | "inStock" | "outOfStock">("all");
  const [loading, setLoading] = useState(!!categorySlug || !!searchQuery);

  useEffect(() => {
    setPage(1);
  }, [categorySlug, searchQuery, sortOption, brand, priceRange, availability]);

  useEffect(() => {
    if (!categorySlug && !searchQuery) return;

    let cancelled = false;
    setLoading(true);

    const fetchProducts = async () => {
      try {
        let categoryIds: string | undefined;
        if (categorySlug) {
          const flatCategories = await listCategoriesFlat();
          const category = flatCategories.find((c) => c.slug === categorySlug);
          const childIds = category ? flatCategories.filter((c) => c.parentId === category.id).map((c) => c.id) : [];
          const ids = category ? [category.id, ...childIds] : [];
          categoryIds = ids.length > 0 ? ids.join(",") : undefined;
        }

        const sortParams = API_SORT_MAP[sortOption] ?? { sortBy: "createdAt", sortOrder: "desc" };
        const result = await listProducts({
          ...(categoryIds ? { categoryIds } : {}),
          ...(searchQuery ? { search: searchQuery } : {}),
          ...(brand ? { brand } : {}),
          ...(priceRange?.minPrice !== undefined ? { minPrice: priceRange.minPrice } : {}),
          ...(priceRange?.maxPrice !== undefined ? { maxPrice: priceRange.maxPrice } : {}),
          ...(availability === "inStock" ? { inStock: true } : {}),
          ...(availability === "outOfStock" ? { inStock: false } : {}),
          page,
          limit: PAGE_SIZE,
          isActive: true,
          ...sortParams,
        });

        if (cancelled) return;

        const displayProducts: DisplayProduct[] = result.products.map((p) => {
          const price = Number(p.price);
          const mrp = p.mrp ? Number(p.mrp) : price;
          const discountPct = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
          const savings = mrp > price ? `₹${(mrp - price).toLocaleString("en-IN")}` : "";
          const image = p.images[0] ?? null;
          return {
            id: p.id,
            slug: p.slug,
            title: p.name,
            price,
            originalPrice: mrp,
            discount: discountPct > 0 ? `${discountPct}% Off` : "",
            savings,
            image,
            isLocalImage: image ? image.startsWith("/") : false,
            rating: "4.0",
            reviews: "0",
            deliveryDate: p.stock > 0 ? "3-5 business days" : "Out of stock",
            stock: p.stock,
          };
        });

        setProducts(displayProducts);
        setTotal(result.pagination.total);
        setTotalPages(result.pagination.totalPages);
      } catch {
        setProducts([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchProducts();
    return () => { cancelled = true; };
  }, [categorySlug, searchQuery, sortOption, brand, priceRange, availability, page]);

  const clearFilters = () => {
    setBrand(undefined);
    setPriceRange(undefined);
    setAvailability("all");
    setPage(1);
  };

  const visiblePages = Array.from(
    { length: Math.min(3, totalPages) },
    (_, index) => Math.max(1, Math.min(page - 1, totalPages - 2)) + index
  ).filter((pageNumber) => pageNumber <= totalPages);

  const goToPage = (nextPage: number) => {
    if (loading || nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    setPage(nextPage);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pb-20">
      <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 lg:px-8">

        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <p className="mb-1 text-xs font-semibold text-[#49A5A2]">
            Home &gt; {searchQuery ? "Search Results" : categoryTitle}
          </p>
          <h1 className="flex items-baseline gap-2 text-3xl font-black text-white">
            {categoryTitle}{" "}
            <span className="text-sm font-medium text-white/50">({loading ? "…" : total})</span>
          </h1>
        </div>

        {/* Filter & Sort Row */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 rounded-md border-white/20 bg-[#1a1a1a] font-medium text-white hover:bg-[#252525] hover:text-white">
                  {brand ?? "Brand"} <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="ml-1 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 rounded-xl border-white/10 bg-[#1a1a1a] p-2">
                <DropdownMenuItem onClick={() => setBrand(undefined)} className="cursor-pointer rounded-md px-3 py-2 text-sm text-white hover:bg-[#252525]">All Brands</DropdownMenuItem>
                {BRAND_OPTIONS.map((opt) => (
                  <DropdownMenuItem key={opt} onClick={() => setBrand(opt)} className="cursor-pointer rounded-md px-3 py-2 text-sm text-white hover:bg-[#252525]">
                    {opt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 rounded-md border-white/20 bg-[#1a1a1a] font-medium text-white hover:bg-[#252525] hover:text-white">
                  {priceRange?.label ?? "Price"} <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="ml-1 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 rounded-xl border-white/10 bg-[#1a1a1a] p-2">
                <DropdownMenuItem onClick={() => setPriceRange(undefined)} className="cursor-pointer rounded-md px-3 py-2 text-sm text-white hover:bg-[#252525]">All Prices</DropdownMenuItem>
                {PRICE_OPTIONS.map((opt) => (
                  <DropdownMenuItem key={opt.label} onClick={() => setPriceRange(opt)} className="cursor-pointer rounded-md px-3 py-2 text-sm text-white hover:bg-[#252525]">
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-9 rounded-md border-white/20 bg-[#1a1a1a] font-medium text-white hover:bg-[#252525] hover:text-white">
                  All Filters <HugeiconsIcon icon={FilterHorizontalIcon} size={16} className="ml-1 opacity-70" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-[350px] flex-col border-l border-white/10 bg-[#0f0f0f] p-0 text-white sm:w-[450px]">
                <SheetHeader className="border-b border-white/10 p-6">
                  <SheetTitle className="text-xl font-bold text-white">All Filters</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-auto p-6">
                  <h3 className="mb-4 text-sm font-semibold text-white">Availability</h3>
                  <div className="flex flex-col gap-4">
                    {["In Stock", "Out of Stock"].map((opt) => (
                      <div key={opt} className="flex items-center space-x-3">
                        <Checkbox
                          id={opt}
                          checked={(opt === "In Stock" && availability === "inStock") || (opt === "Out of Stock" && availability === "outOfStock")}
                          onCheckedChange={(checked) => setAvailability(checked ? (opt === "In Stock" ? "inStock" : "outOfStock") : "all")}
                          className="rounded-[4px] border-white/40 data-[state=checked]:border-[#49A5A2] data-[state=checked]:bg-[#49A5A2]"
                        />
                        <label htmlFor={opt} className="text-sm font-medium leading-none text-white/80">{opt}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 border-t border-white/10 bg-[#0f0f0f] p-6">
                  <Button onClick={clearFilters} variant="outline" className="flex-1 rounded-sm border-white/20 bg-transparent text-white hover:bg-[#1a1a1a] hover:text-white">
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
                <Button variant="ghost" className="h-9 px-2 font-bold text-white hover:bg-transparent hover:text-white">
                  {sortOption} <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl border-white/10 bg-[#1a1a1a] p-2">
                {SORT_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt}
                    onClick={() => setSortOption(opt)}
                    className={`cursor-pointer rounded-lg px-4 py-2 text-sm ${sortOption === opt ? "bg-[#49A5A2]/10 font-semibold text-[#49A5A2]" : "text-white hover:bg-[#252525]"}`}
                  >
                    {opt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="mb-4 aspect-square rounded-2xl bg-white/5" />
                <div className="h-4 w-3/4 rounded bg-white/5 mb-2" />
                <div className="h-4 w-1/2 rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/60">
                No products match these filters.
              </div>
            ) : products.map((prod) => (
              <Link key={prod.id} href={`/product/${prod.slug}`} className="group flex flex-col">
                {/* Image Card */}
                <div className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 transition-colors group-hover:border-[#49A5A2]/30 sm:aspect-[4/3]">
                  <div className="absolute right-4 top-4 z-10 flex items-center gap-3">
                    <button className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-sm transition-colors hover:bg-black/80">
                      <HugeiconsIcon icon={FavouriteIcon} size={16} className="text-white/80" />
                    </button>
                    <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2.5 py-1.5 backdrop-blur-sm transition-colors hover:bg-black/80">
                      <Checkbox id={`cmp-${prod.id}`} className="h-3.5 w-3.5 rounded-[4px] border-white/50 data-[state=checked]:border-[#49A5A2] data-[state=checked]:bg-[#49A5A2]" />
                      <label htmlFor={`cmp-${prod.id}`} className="cursor-pointer text-xs font-semibold text-white">Compare</label>
                    </div>
                  </div>

                  <div className="relative h-full w-full p-4 transition-transform duration-500 group-hover:scale-105">
                    {prod.image ? (
                      prod.isLocalImage ? (
                        <Image
                          src={prod.image}
                          alt={prod.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="h-full w-full object-contain"
                        />
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl text-white/20">
                        📦
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col px-1">
                  <h3 className="mb-2 line-clamp-2 text-base font-bold leading-tight text-white transition-colors group-hover:text-[#49A5A2]">
                    {prod.title}
                  </h3>

                  {prod.rating && (
                    <div className="mb-3 flex items-center gap-1">
                      <span className="text-sm font-bold tracking-wide text-[#49A5A2]">{prod.rating}</span>
                      <HugeiconsIcon icon={StarIcon} size={14} className="fill-[#49A5A2] text-[#49A5A2]" />
                      {prod.reviews !== "0" && (
                        <span className="text-sm text-white/50">({prod.reviews})</span>
                      )}
                    </div>
                  )}

                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="text-xl font-black text-white">
                      ₹{prod.price.toLocaleString("en-IN")}
                    </span>
                    {prod.originalPrice > prod.price && (
                      <>
                        <span className="text-sm font-semibold text-white/40 line-through">
                          ₹{prod.originalPrice.toLocaleString("en-IN")}
                        </span>
                        {prod.savings && (
                          <span className="ml-1 text-[11px] font-medium text-white/50">(Save {prod.savings})</span>
                        )}
                        {prod.discount && (
                          <span className="ml-1 rounded-sm bg-white px-2 py-0.5 text-xs font-bold text-black">
                            {prod.discount}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {prod.deliveryDate && (
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-xs font-medium text-white/70">
                        🚚 Delivery by {prod.deliveryDate}
                      </span>
                    </div>
                  )}

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
        )}

        {/* View More */}
        <div className="mb-16 mt-12">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={page <= 1 || loading}
                  className={page <= 1 || loading ? "pointer-events-none opacity-40" : ""}
                  onClick={(event) => {
                    event.preventDefault();
                    goToPage(page - 1);
                  }}
                />
              </PaginationItem>
              {visiblePages.map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === page}
                    className="text-white"
                    onClick={(event) => {
                      event.preventDefault();
                      goToPage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={page >= totalPages || loading}
                  className={page >= totalPages || loading ? "pointer-events-none opacity-40" : ""}
                  onClick={(event) => {
                    event.preventDefault();
                    goToPage(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* SEO Section */}
        {!searchQuery && (
          <div className="mx-auto mb-12 max-w-4xl border-t border-white/10 pt-12 text-left">
            <h2 className="mb-6 text-2xl font-black text-white">
              The best {categoryTitle} at VolteX
            </h2>
            <p className="mb-6 text-sm font-medium leading-relaxed text-white/50">
              Explore our curated selection of {categoryTitle} from top brands. Whether you&apos;re looking for the latest models or the best value options, VolteX has you covered with fast delivery and easy returns.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
