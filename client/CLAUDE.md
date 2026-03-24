@AGENTS.md

# VolteX E-Commerce — Client

## Overview
Electronics e-commerce frontend (like Croma/Reliance Digital). Mid-alpha stage — UI built, no backend yet.

## Tech Stack
- **Next.js 16.2.1** (App Router) — React 19, TypeScript 5
- **Tailwind CSS 4** via `@tailwindcss/postcss`
- **shadcn/ui** (Radix primitives) — 60+ components in `/components/ui/`
- **Embla Carousel** (with autoplay) for all carousels
- **HugeIcons** (`@hugeicons/react` + `@hugeicons/core-free-icons`) for icons
- **next-themes** for dark/light mode, **Sonner** for toasts

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Project Structure
```
app/
  layout.tsx              # Root layout (Geist, Inter, Roboto fonts)
  page.tsx                # Home — composes 14+ section components
  globals.css             # Tailwind imports, CSS vars (oklch), keyframes
  category/
    [categorySlug]/
      page.tsx            # Category listing page
      [subcategorySlug]/
        page.tsx          # Subcategory listing page

components/
  global/                 # Page-level / feature components
    navbarSection.tsx     # Sticky navbar with search, mega-menu
    navbar/
      nav-data.ts         # NAV_CATEGORIES, TRENDING_SEARCHES
      mega-menu.tsx       # Desktop mega dropdown
      mobile-menu.tsx     # Mobile drawer (Sheet component)
    heroSection.tsx       # Hero carousel (Embla + autoplay)
    CategorySlider.tsx    # Horizontal scrollable category cards
    ProductListingTemplate.tsx  # Category page grid + filters + sort
    ProductShowcaseSection.tsx  # Featured products carousel
    OfferCards.tsx         # Bank offer cards
    PromoBannerPair.tsx   # Side-by-side banners
    FullWidthPromoBanner.tsx
    ExclusiveDealsSection.tsx
    GreaterSavingsDealsSection.tsx
    BrandsSection.tsx
    InfoCardsSection.tsx
    StatsEcoFeaturesSection.tsx
    FooterSection.tsx
  ui/                     # shadcn/Radix primitives (do not edit manually)

hooks/
  use-mobile.ts           # useIsMobile() — 768px breakpoint
  use-horizontal-carousel.ts  # Scroll metrics & nav for carousels

lib/
  utils.ts                # cn() — clsx + tailwind-merge
```

## Key Patterns

### Routing
- Dynamic slugs in kebab-case: `"Mobiles, Tablets & Accessories"` → `mobiles-tablets-accessories`
- Page components are async, params are awaited

### Data
- **All data is currently mock/hardcoded** inside components (MOCK_PRODUCTS, defaultCategories, etc.)
- Components accept optional props with defaults — ready for API integration

### Styling
- Primary color: `#dc2626` (red) via CSS variable `--primary`
- oklch color space for theming
- Mobile-first responsive design (hidden/flex at lg breakpoint)
- `cn()` helper for conditional classes everywhere

### State Management
- Local `useState` / `useRef` only — no global state library
- No Context providers beyond next-themes

### Components
- `"use client"` directive on interactive components (navbar, filters, carousels)
- Server components by default for pages
- All carousels use `useHorizontalCarousel` hook or Embla

## Git Workflow
- Feature branches: `@ui/herosection`, `@ui/navbarsection`
- PR-based merges to `main`

## Not Yet Implemented
- Backend API integration
- Authentication
- Cart & checkout
- Real search (UI exists, no logic)
- Product detail pages
- User accounts
