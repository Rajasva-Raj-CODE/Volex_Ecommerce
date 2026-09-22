import { Platform } from "react-native";

/**
 * VolteX mobile design system.
 *
 * Layout model: quick-commerce (Blinkit-style) — a branded promise header, a
 * dense category grid, compact product cards with an inline ADD action, and
 * horizontal rails. Light canvas, white cards, tight spacing, high information
 * density. See DESIGN_SYSTEM.md.
 *
 * Brand: VolteX teal, shared with the web storefront and admin. We deliberately
 * did NOT adopt Blinkit's yellow/green — that's their brand identity, not ours.
 *
 * Interaction stays native (platform tabs, headers, haptics, SF Symbols); it's
 * the visual language that follows the quick-commerce pattern.
 */

export const color = {
  /** Brand teal — header, accents, ADD action, active states. */
  brand: "#49A5A2",
  brandDark: "#3D8E8B",
  /** Deep end of the brand gradient. Flat fills read as unfinished at scale. */
  brandDeep: "#2E7F7D",
  /** Very light teal wash for selected chips and badges. */
  brandWash: "#E9F4F4",
  onBrand: "#FFFFFF",

  /** Light canvas behind white cards — the quick-commerce staple. */
  canvas: "#F6F7F8",
  card: "#FFFFFF",
  /** Image wells and pressed rows. */
  well: "#F2F3F5",

  separator: "#ECEDEF",
  border: "#E2E4E7",

  label: "#1C1C1E",
  secondaryLabel: "#6B6F76",
  tertiaryLabel: "#9CA1A8",

  /** Savings, in-stock. Green reads as "good deal" in Indian commerce UI. */
  positive: "#1B8D3A",
  positiveWash: "#E7F5EB",
  destructive: "#D93025",
  /** Discount ribbon on product cards. */
  ribbon: "#2A6DF4",
} as const;

/**
 * Compact commerce type scale. Quick-commerce apps run smaller and denser than
 * the platform default so more product fits above the fold.
 */
export const type = {
  hero: { fontSize: 24, lineHeight: 29, fontWeight: "800" },
  title: { fontSize: 19, lineHeight: 24, fontWeight: "700" },
  section: { fontSize: 17, lineHeight: 22, fontWeight: "700" },
  price: { fontSize: 14, lineHeight: 18, fontWeight: "700" },
  body: { fontSize: 14, lineHeight: 19, fontWeight: "400" },
  cardTitle: { fontSize: 13, lineHeight: 17, fontWeight: "500" },
  action: { fontSize: 13, lineHeight: 16, fontWeight: "700" },
  meta: { fontSize: 12, lineHeight: 15, fontWeight: "400" },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: "600" },
} as const;

/** 4pt grid. `gutter` (12) is tighter than a platform default — density matters. */
export const space = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  gutter: 12,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  pill: 999,
} as const;

/** Soft card lift. Android needs elevation, iOS needs the shadow quad. */
export const shadow = Platform.select({
  ios: {
    // Tinted toward the brand rather than pure black — a neutral shadow on a
    // warm-neutral canvas reads as grey dirt around the card edge.
    shadowColor: "#0B2B2A",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  default: { elevation: 2 },
})!;

/**
 * Brand gradient. A single flat teal across a large surface looks unfinished on
 * a phone; a shallow two-stop ramp gives it depth without becoming decorative.
 */
export const brandGradient = ["#4FB0AC", "#49A5A2", "#3D8E8B"] as const;

/** A card lift one step above `shadow`, for surfaces that float over content. */
export const shadowRaised = Platform.select({
  ios: {
    shadowColor: "#0B2B2A",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  default: { elevation: 6 },
})!;

/** Native minimum touch target: 44pt on iOS, 48dp on Android. */
export const HIT_SLOP_MIN = Platform.select({ ios: 44, default: 48 })!;
