import type { ProductHighlight } from "@/lib/types";

interface ProductHighlightsProps {
  highlights: ProductHighlight[];
}

export default function ProductHighlights({ highlights }: ProductHighlightsProps) {
  return (
    <section className="mb-12 rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 sm:p-8">
      <h2 className="mb-5 text-lg font-bold text-white">Key Highlights</h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#49A5A2]" />
            <span className="text-sm text-white/80">{h.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
