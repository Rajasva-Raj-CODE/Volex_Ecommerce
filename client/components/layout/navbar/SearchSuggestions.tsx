"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useDebounce } from "@/hooks/use-debounce";
import { listProducts } from "@/lib/catalog-api";

interface SearchSuggestionsProps {
  searchValue: string;
  onClose: () => void;
}

interface SuggestionProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  mrp?: number;
  brand?: string;
  image: string | null;
}

export function SearchSuggestions({ searchValue, onClose }: SearchSuggestionsProps) {
  const debouncedQuery = useDebounce(searchValue.trim(), 300);
  const [results, setResults] = useState<SuggestionProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const lastQueryRef = useRef("");

  const fetchSuggestions = useCallback(async (query: string) => {
    lastQueryRef.current = query;
    setLoading(true);
    try {
      const data = await listProducts({ search: query, limit: 5, isActive: true });
      if (lastQueryRef.current !== query) return; // stale
      setResults(
        data.products.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: Number(p.price),
          mrp: p.mrp ? Number(p.mrp) : undefined,
          brand: p.brand ?? undefined,
          image: p.images[0] ?? null,
        }))
      );
    } catch {
      if (lastQueryRef.current === query) setResults([]);
    } finally {
      if (lastQueryRef.current === query) {
        setLoading(false);
        setSearched(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!debouncedQuery) {
      lastQueryRef.current = "";
      return;
    }
    void fetchSuggestions(debouncedQuery);
  }, [debouncedQuery, fetchSuggestions]);

  if (!debouncedQuery && !loading) return null;

  // Loading skeletons
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-3/4 rounded bg-gray-100" />
              <div className="h-3 w-1/3 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // No results
  if (searched && results.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <HugeiconsIcon icon={Search01Icon} size={32} className="text-gray-300 mb-3" />
        <p className="text-[15px] font-semibold text-gray-700">No results found</p>
        <p className="text-[13px] text-gray-400 mt-1">
          Try a different search term
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Product suggestions */}
      <div className="space-y-1">
        {results.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            onClick={onClose}
            className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-50 shrink-0 flex items-center justify-center overflow-hidden">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <div className="text-gray-300 text-lg">📦</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-gray-900 truncate">
                {product.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-gray-800">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <span className="text-[12px] text-gray-400 line-through">
                    ₹{product.mrp.toLocaleString("en-IN")}
                  </span>
                )}
                {product.brand && (
                  <span className="text-[11px] text-gray-400 uppercase">{product.brand}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* See all results */}
      <Link
        href={`/search?q=${encodeURIComponent(searchValue.trim())}`}
        onClick={onClose}
        className="flex items-center justify-between mt-4 px-3 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
      >
        <span className="text-[13px] font-semibold text-[#49A5A2]">
          See all results for &ldquo;{searchValue.trim()}&rdquo;
        </span>
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-[#49A5A2] group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
