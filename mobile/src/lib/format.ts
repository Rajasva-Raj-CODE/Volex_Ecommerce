/** Indian-format currency, matching the storefront (₹1,29,900). */
export function formatPrice(value: string | number | null | undefined) {
  const n = typeof value === "string" ? Number(value) : value;
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function discountPercent(
  price: string | number,
  mrp: string | number | null | undefined
) {
  const p = Number(price);
  const m = Number(mrp);
  if (!m || Number.isNaN(m) || Number.isNaN(p) || m <= p) return null;
  return Math.round(((m - p) / m) * 100);
}

export function ratingValue(rating: string | number | null | undefined) {
  const n = typeof rating === "string" ? Number(rating) : rating;
  if (n === null || n === undefined || Number.isNaN(n) || n <= 0) return null;
  return n;
}
