# VolteX — Customer Storefront

The customer-facing e-commerce frontend for VolteX. Built with **Next.js 16** (App Router), React 19, and Tailwind CSS 4. Inspired by Croma / Reliance Digital.

> **Status:** UI complete — all pages built with mock data. Backend integration is next.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 16.2.1 | Framework (SSR + App Router) |
| React | 19.2.4 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| shadcn/ui | latest | Component library (Radix primitives) |
| Embla Carousel | latest | All carousels |
| HugeIcons | 1.1.6 | Icon set |
| next-themes | latest | Dark/light mode |
| Sonner | latest | Toast notifications |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000

# Production build
npm run build

# Lint
npm run lint
```

---

## Project Structure

```
client/
├── app/                          # Next.js App Router (pages & layouts)
│   ├── layout.tsx               # Root layout (fonts: Geist, Inter, Roboto)
│   ├── page.tsx                 # Home page (14+ section components)
│   ├── globals.css              # Tailwind + CSS variables (oklch) + keyframes
│   ├── (account)/               # Route group — all account pages
│   │   ├── profile/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── wishlist/page.tsx
│   │   ├── address/page.tsx
│   │   ├── notifications/page.tsx
│   │   └── settings/page.tsx
│   ├── login/page.tsx
│   ├── cart/page.tsx
│   ├── category/
│   │   └── [categorySlug]/
│   │       ├── page.tsx         # Category listing
│   │       └── [subcategorySlug]/page.tsx
│   └── product/
│       └── [productSlug]/page.tsx
│
├── components/
│   ├── home/                    # Homepage sections (14 components)
│   │   ├── HeroSection.tsx      # Hero carousel (Embla + autoplay)
│   │   ├── CategorySlider.tsx
│   │   ├── DealsOfDay.tsx
│   │   ├── ProductShowcase.tsx
│   │   ├── BrandsCarousel.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Footer.tsx
│   │   └── navbar/
│   │       ├── Navbar.tsx       # Sticky top nav
│   │       ├── MegaMenu.tsx     # Desktop mega dropdown
│   │       ├── MobileMenu.tsx   # Mobile drawer
│   │       └── nav-data.ts      # Navigation categories + search data
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx
│   │   └── ProductListingTemplate.tsx
│   ├── account/                 # Profile, orders, wishlist, etc.
│   ├── auth/                    # Login / register forms
│   ├── cart/                    # Cart components
│   └── ui/                      # shadcn/ui primitives (DO NOT edit manually)
│
├── hooks/
│   ├── use-mobile.ts            # useIsMobile() — 768px breakpoint
│   └── use-horizontal-carousel.ts
│
├── lib/
│   ├── utils.ts                 # cn() — clsx + tailwind-merge
│   ├── types.ts                 # Shared TypeScript types
│   └── product-data.ts          # Mock product data (replace with API calls)
│
├── contexts/
│   └── AuthContext.tsx          # Auth context (stub, not wired to backend)
│
└── public/
    └── assets/                  # Static images
```

---

## Pages

| Route | Page |
|-------|------|
| `/` | Home — hero, categories, deals, brands |
| `/login` | Login / Register |
| `/cart` | Shopping cart |
| `/category/[slug]` | Category listing with filters |
| `/category/[slug]/[sub]` | Subcategory listing |
| `/product/[slug]` | Product detail |
| `/(account)/profile` | User profile |
| `/(account)/orders` | Order history |
| `/(account)/wishlist` | Saved items |
| `/(account)/address` | Saved addresses |
| `/(account)/notifications` | Notification settings |
| `/(account)/settings` | Account settings |

---

## Key Patterns

### Styling
- Primary color: `#dc2626` (red), set via `--primary` CSS variable
- `cn()` helper for all conditional class names
- Mobile-first; responsive at `lg` (1024px)

### Data (Current — Mock)
- All product/category data is hardcoded in `lib/product-data.ts` and inside components
- Components accept optional props with defaults — ready for API swap

### Routing
- Slugs are kebab-case: `"Mobiles & Accessories"` → `mobiles-accessories`
- Page components are `async`; params are `await`ed

### Components
- `"use client"` on interactive components (navbar, carousels, filters)
- Server components by default for pages

---

## Environment Variables

Create `.env.local` at the root of `/client`:

```env
# When backend is ready:
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=VolteX
```

---

## What's Built vs What's Next

### Built (UI)
- [x] Responsive home page with all sections
- [x] Sticky navbar + mega menu + mobile drawer
- [x] Category & subcategory listing with filters
- [x] Product detail page
- [x] Cart page
- [x] Full account section (profile, orders, wishlist, etc.)
- [x] Login / register forms (UI only)

### TODO (Backend Integration)
- [ ] Connect auth forms to `/api/auth/*` endpoints
- [ ] Replace mock products with API calls
- [ ] Wire cart to backend (add/remove/update)
- [ ] Wire wishlist to backend
- [ ] Real order placement and tracking
- [ ] Real search (UI exists, no logic)
- [ ] Image optimization with real CDN URLs
