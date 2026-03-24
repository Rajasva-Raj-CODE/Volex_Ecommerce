// ─── Hero / Banners ──────────────────────────────────────────────
export interface HeroBanner {
  id: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
  mobileImageSrc?: string;
  bgColor?: string;
  heading?: string;
  subheading?: string;
  price?: string;
  offerText?: string;
  buttonText?: string;
  disclaimer?: string;
  /** "left" = image left / text right, "right" = text left / image right */
  imagePosition?: "left" | "right";
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  href?: string;
  imageSrc: string;
  imageAlt: string;
  dark?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
}

// ─── Navigation ──────────────────────────────────────────────────
export interface SubCategory {
  label: string;
  slug: string;
  icon?: string;
}

export interface NavCategory {
  label: string;
  slug?: string;
  subcategories?: SubCategory[];
  banners?: {
    type: "wide-stack" | "square-side";
    images?: string[];
  };
}

// ─── Categories ──────────────────────────────────────────────────
export interface CategoryItem {
  id: string;
  label: string;
  image?: string;
  href?: string;
  icon?: string;
}

// ─── Products ────────────────────────────────────────────────────
export interface Product {
  id: string;
  title: string;
  imageSrc: string;
  price: string;
  mrp?: string;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
  bankOffer?: string;
  noCostEmi?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  boughtLabel?: string;
  preBookLabel?: string;
  href?: string;
}

// ─── What's Hot ──────────────────────────────────────────────────
export interface WhatsHotItem {
  id: string;
  title: string;
  imageSrc: string;
  startingPrice: string;
  badge?: string;
  href?: string;
}

// ─── Offers ──────────────────────────────────────────────────────
export interface BankOffer {
  id: string;
  primary: string;
  logo?: string;
  offer: string;
}

// ─── Brands ──────────────────────────────────────────────────────
export interface Brand {
  id: string;
  name: string;
  logoSrc?: string;
  href?: string;
}

// ─── Trust / Info ────────────────────────────────────────────────
export interface TrustPillar {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
}

export interface StatItem {
  number: string;
  description: string;
}

// ─── Curated ─────────────────────────────────────────────────────
export interface CuratedTab {
  id: string;
  label: string;
}

export interface CuratedItem {
  id: string;
  title: string;
  imageSrc: string;
  description?: string;
  href?: string;
  tabId: string;
}

// ─── Footer ──────────────────────────────────────────────────────
export interface FooterLinkColumn {
  heading: string;
  links: { label: string; href: string }[];
}
