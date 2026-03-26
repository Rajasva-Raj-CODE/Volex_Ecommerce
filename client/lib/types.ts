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

// ─── Product Detail ──────────────────────────────────────────────
export interface ProductDetailImage {
  id: string;
  src: string;
  alt: string;
}

export interface ProductHighlight {
  text: string;
}

export interface ProductSpecGroup {
  groupName: string;
  specs: { label: string; value: string }[];
}

export interface ProductVariantGroup {
  name: string;
  options: { label: string; selected?: boolean }[];
}

export interface ProductOverviewSection {
  heading: string;
  description: string;
}

export interface ProductDetail {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  brand: string;
  images: ProductDetailImage[];
  price: number;
  originalPrice: number;
  discount: string;
  savings: string;
  rating: string;
  reviews: string;
  ratingCount?: string;
  deliveryDate: string;
  deliveryFee?: string;
  inStock: boolean;
  bankOffers: { id: string; bank: string; description: string }[];
  highlights: ProductHighlight[];
  specGroups: ProductSpecGroup[];
  overview?: ProductOverviewSection[];
  variants?: ProductVariantGroup[];
  relatedProductIds: string[];
  emiStartsAt?: string;
  noCostEmi?: boolean;
  warranty?: string;
  extraDiscount?: string;
}

// ─── Footer ──────────────────────────────────────────────────────
export interface FooterLinkColumn {
  heading: string;
  links: { label: string; href: string }[];
}
