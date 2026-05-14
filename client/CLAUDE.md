@../CLAUDE.md

# VolteX E-Commerce — Client (Storefront)

## Overview

Customer-facing storefront for an electronics e-commerce platform. Built with Next.js 16 App Router. Most pages are API-integrated — auth, cart, checkout, orders, wishlist, addresses all work with the real backend. Some homepage sections still use hardcoded data.

**Status:** ~85% integrated. Core shopping flow (browse → cart → checkout → order) is fully functional.

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.1 |
| UI | React | 19.2.4 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS | 4 (via @tailwindcss/postcss) |
| Components | shadcn/ui (Radix primitives) | 45+ components |
| Carousels | Embla Carousel + autoplay | — |
| Icons | HugeIcons (@hugeicons/react) | — |
| Toasts | Sonner | — |
| Theming | next-themes | — (installed, no toggle UI) |
| Fonts | Inter, Roboto, Geist, Geist Mono | Google Fonts |

## Commands

```bash
npm run dev     # Next.js dev server → :3000
npm run build   # Production build
npm run lint    # ESLint
```

## Project Structure

```
client/
├── app/
│   ├── layout.tsx                          # Root layout — AuthProvider, Toaster, fonts
│   ├── page.tsx                            # Home — 14 section components
│   ├── globals.css                         # Tailwind imports, CSS vars (oklch), keyframes
│   ├── login/page.tsx                      # Login/Register page
│   ├── search/page.tsx                     # Search results
│   ├── cart/page.tsx                       # Shopping cart
│   ├── checkout/
│   │   ├── page.tsx                        # Checkout (address + payment)
│   │   └── success/page.tsx                # Order confirmation
│   ├── product/[productSlug]/page.tsx      # Product detail (dynamic metadata)
│   ├── category/
│   │   ├── [categorySlug]/page.tsx         # Category listing
│   │   └── [categorySlug]/[subcategorySlug]/page.tsx  # Subcategory listing
│   ├── (account)/                          # Protected account group
│   │   ├── layout.tsx                      # Account sidebar layout
│   │   ├── profile/page.tsx
│   │   ├── address/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── wishlist/page.tsx
│   │   ├── notifications/page.tsx          # ⚠️ Placeholder only
│   │   └── settings/page.tsx               # ⚠️ Placeholder only
│   ├── my-account/page.tsx                 # Redirect to profile
│   ├── tools/image-extractor/page.tsx      # Utility (not core)
│   └── api/                                # Next.js API routes (utility)
│
├── components/
│   ├── ui/                     # shadcn/Radix primitives (DO NOT EDIT MANUALLY)
│   ├── home/                   # 14 homepage section components
│   │   ├── HeroSection.tsx     # Embla carousel with autoplay
│   │   ├── CategorySlider.tsx  # Horizontal category cards (real API data)
│   │   ├── BankOffers.tsx      # Static bank offer cards
│   │   ├── ProductShowcase.tsx # Featured products carousel
│   │   ├── WhatsHot.tsx        # Trending items
│   │   ├── DealsOfDay.tsx      # Time-sensitive deals
│   │   ├── FromVolteX.tsx      # Branded products
│   │   ├── WarrantyBanner.tsx  # Promo banner
│   │   ├── UnboxedBlog.tsx     # Blog carousel
│   │   ├── TataNeu.tsx         # Brand spotlight
│   │   ├── CuratedSection.tsx  # Tabbed product grid
│   │   ├── WhyVolteX.tsx       # Trust pillars
│   │   └── BrandsCarousel.tsx  # Brand logos
│   ├── auth/
│   │   ├── LoginClient.tsx         # Login/register form
│   │   ├── LoginModal.tsx          # Global login modal (overlay)
│   │   └── ProtectedPage.tsx       # Auth guard wrapper
│   ├── layout/
│   │   └── navbar/
│   │       ├── Navbar.tsx          # Main navbar (search, mega-menu, cart badge)
│   │       ├── MegaMenu.tsx        # Desktop category dropdown
│   │       ├── MobileMenu.tsx      # Mobile drawer
│   │       ├── SearchSuggestions.tsx # Search overlay
│   │       └── UserDropdown.tsx    # User menu
│   ├── product/
│   │   ├── ProductImageGallery.tsx # Image carousel with thumbnails
│   │   ├── ProductInfo.tsx         # Price, variants, actions
│   │   ├── ProductSpecifications.tsx # Specs accordion
│   │   ├── StickyBottomBar.tsx     # Floating cart/wishlist/buy bar
│   │   └── RelatedProducts.tsx     # Related items carousel
│   ├── cart/CartClient.tsx         # Full cart UI
│   ├── checkout/
│   │   ├── CheckoutClient.tsx      # Address + payment + order summary
│   │   └── OrderSuccessClient.tsx  # Confirmation page
│   ├── account/                    # Account page sub-components
│   └── shared/
│       └── ProductListingTemplate.tsx  # Reusable category/search template
│
├── contexts/
│   └── AuthContext.tsx     # Global auth state — login, register, guest, logout, token refresh
│
├── lib/
│   ├── api.ts              # Base fetch wrapper + ApiError class
│   ├── auth-api.ts         # authedApiRequest — Bearer token + auto-refresh on 401
│   ├── catalog-api.ts      # Categories (tree/flat) + Products (search/filter/paginate)
│   ├── cart-api.ts          # Cart CRUD
│   ├── orders-api.ts        # Orders (my, detail, create)
│   ├── payments-api.ts      # Razorpay order + verify
│   ├── address-api.ts       # Address CRUD
│   ├── wishlist-api.ts      # Wishlist CRUD
│   ├── product-data.ts      # Mock product fallback data
│   ├── cart-events.ts       # Custom event dispatching for cart badge sync
│   ├── types.ts             # Shared TypeScript interfaces
│   └── utils.ts             # cn() helper
│
├── hooks/
│   ├── use-mobile.ts                   # useIsMobile() — 768px breakpoint
│   ├── use-debounce.ts                 # Generic debounce
│   └── use-horizontal-carousel.ts      # Carousel scroll metrics
│
├── public/assets/          # Static images (heroes, extracted product images)
├── next.config.ts          # Image remote patterns (unsplash, supabase, placeholder)
├── postcss.config.mjs
└── .env / .env.example
```

## Authentication Flow

### AuthContext (`contexts/AuthContext.tsx`)
Central auth state for the entire app:
- **State:** `isLoggedIn`, `isReady`, `user`, `loginModalOpen`
- **Methods:** `login()`, `register()`, `continueAsGuest()`, `logout()`, `openLoginModal()`, `closeLoginModal()`
- **Bootstrap:** On mount, checks localStorage for tokens → fetches `/auth/me` → sets `isReady=true`
- **Token storage:** `voltex_access_token`, `voltex_refresh_token` in localStorage
- **Auto-refresh:** On 401, tries refresh token once → retries request → clears tokens if refresh fails

### Protected Pages
- Wrap with `<ProtectedPage>` component
- Shows spinner while `isReady` is false
- Shows login prompt if not authenticated
- Any component can trigger login modal via `useAuth().openLoginModal()`

### Guest Checkout
- "Continue as Guest" creates a temporary account with auto-generated credentials
- Guest gets full auth tokens — can complete checkout

## Shopping Flow

### Browse → Cart → Checkout → Order
1. **Browse:** Category/search pages use `ProductListingTemplate` with real API filters (brand, price, stock, sort, pagination)
2. **Product Detail:** Fetches from API, falls back to mock data if unavailable
3. **Add to Cart:** `POST /cart` — dispatches `voltex:cart-updated` event (Navbar listens for badge count)
4. **Cart Page:** Fetch cart, adjust quantities, remove items, move to wishlist
5. **Checkout:** Select/create address → Razorpay payment → verify → order created
6. **Success:** Display order confirmation with ID, items, address

### Razorpay Integration
1. Call `POST /payments/razorpay/order` → get keyId, orderId, amount
2. Dynamically load Razorpay script
3. Open Razorpay Checkout modal (test mode)
4. On success, call `POST /payments/razorpay/verify` with signature
5. Redirect to `/checkout/success?orderId={id}`

## API Integration

### Base Client (`lib/api.ts`)
```typescript
apiRequest<T>(path, options) // Base fetch wrapper, JSON parsing, ApiError on failure
```

### Authenticated Client (`lib/auth-api.ts`)
```typescript
authedApiRequest<T>(path, options) // Adds Bearer token, auto-refresh on 401
```

### All API Modules
| Module | Endpoints Used |
|--------|---------------|
| catalog-api | GET /categories, /categories/flat, /products (with all filter params) |
| cart-api | GET/POST/PUT/DELETE /cart |
| orders-api | GET /orders/my, /orders/:id, POST /orders |
| payments-api | POST /payments/razorpay/order, /payments/razorpay/verify |
| address-api | GET/POST/PUT/DELETE /addresses |
| wishlist-api | GET/POST/DELETE /wishlist |
| auth-api | POST /auth/customer/login, /register, /logout, /refresh, GET /auth/me |

## Styling

- **Primary color:** `#49A5A2` (teal) — CSS variable `--primary`
- **Dark mode colors:** Hard-coded dark theme (`#0f0f0f` background)
- **Color space:** oklch for CSS variables
- **Pattern:** Mobile-first responsive, `hidden lg:block` breakpoints
- **Utility:** `cn()` (clsx + tailwind-merge) everywhere
- **Custom CSS:** `.scrollbar-none` for carousels, `.offer-marquee` keyframe

## Key Patterns

- **Server components** by default for pages (async data fetching)
- **`"use client"`** directive on interactive components
- **Mock fallback:** Product detail page tries API first, falls back to `lib/product-data.ts`
- **Cart events:** Custom `voltex:cart-updated` event for cross-component sync
- **Dynamic metadata:** Product pages generate SEO metadata from product data
- **Image remote patterns:** Configured for unsplash, placeholder.com, supabase

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
```

## What's Working

- Home page with real category data from API
- Product listing with filters, sorting, pagination
- Product detail with specs, images, variants, bank offers
- Full auth flow (login, register, guest, token refresh)
- Cart operations (add, update, remove, clear)
- Checkout with address selection + Razorpay payment
- Order history listing
- Wishlist CRUD
- Address management
- Search with API integration
- Responsive design (mobile + desktop)
- Navbar with mega-menu, mobile drawer, cart badge

## What's NOT Working / Placeholder

- Notifications page — empty placeholder
- Settings page — empty placeholder
- Order detail page — only list view, no expanded detail
- Dark/light mode toggle — next-themes installed, no UI control
- Voice search — mic icon is UI-only
- Coupon codes — "Apply Coupon" button is UI-only
- Product reviews — display only, no submission form
- Search suggestions — hardcoded mock (trending/recent)
- Forgot password — no flow exists
- Profile picture upload — not implemented
- Several homepage sections use hardcoded mock data (deals, blogs, brands)
- sitemap.xml / robots.txt — not generated
