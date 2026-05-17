@../CLAUDE.md

# VolteX E-Commerce — Client (Storefront)

## Overview

Customer-facing storefront for an electronics e-commerce platform. Built with Next.js 16 App Router. Most pages are API-integrated — auth, cart, checkout, orders, wishlist, addresses all work with the real backend. Some homepage sections still use hardcoded data.

**Status (May 2026):** Fully API-integrated across all customer flows including reviews, coupons, forgot password, and order detail. Notifications and Settings UIs are built but Notifications uses mock data (no notifications API) and Settings save handlers are not wired. Deployed on Vercel.

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
│   │   ├── profile/page.tsx                # Edit name, phone, avatar
│   │   ├── address/page.tsx                # Address CRUD
│   │   ├── orders/page.tsx                 # Order list
│   │   ├── orders/[orderId]/page.tsx       # Order detail (items, address, payment, status)
│   │   ├── wishlist/page.tsx
│   │   ├── notifications/page.tsx          # ⚠️ UI built, uses mock data (no notifications API yet)
│   │   └── settings/page.tsx               # ⚠️ UI built, save handlers not wired
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
│   │   ├── RelatedProducts.tsx     # Related items carousel
│   │   ├── ReviewSection.tsx       # Display reviews with rating breakdown
│   │   └── ReviewSubmitModal.tsx   # Customer review submission form
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
│   ├── auth-api.ts         # authedApiRequest + login/register/logout/refresh/forgot/reset password helpers
│   ├── catalog-api.ts      # Categories (tree/flat) + Products (search/filter/paginate)
│   ├── cart-api.ts          # Cart CRUD
│   ├── orders-api.ts        # Orders (my, detail, create)
│   ├── payments-api.ts      # Razorpay order + verify
│   ├── address-api.ts       # Address CRUD
│   ├── wishlist-api.ts      # Wishlist CRUD
│   ├── coupon-api.ts        # Validate coupon at checkout
│   ├── reviews-api.ts       # List + submit product reviews
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
| coupon-api | POST /coupons/validate (at checkout) |
| reviews-api | GET /reviews/products/:id, POST /reviews/products/:id |
| auth-api | POST /auth/customer/login, /register, /logout, /refresh, /forgot-password, /reset-password, GET /auth/me, PUT /users/profile, PUT /users/change-password |

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

## ✅ What's Built

### Pages (all wired with real APIs)
- [x] Home — hero, real category slider, bank offers, multiple product showcases, brands carousel
- [x] Search — query, filters, pagination
- [x] Category + subcategory listing — filters (brand, price, stock), sorting, pagination
- [x] Product detail — gallery, specs, variants, bank offers, **reviews + submit modal**, related products
- [x] Cart — add/update/remove, subtotal, move-to-wishlist
- [x] Checkout — address selection, **coupon validation**, Razorpay integration, order summary
- [x] Checkout success — order confirmation with ID, items, address
- [x] Login — customer login, customer register, guest checkout, **forgot password OTP flow + reset password**
- [x] My Account hub
- [x] Account/Profile — edit name, phone, avatar
- [x] Account/Address — CRUD with default flag
- [x] Account/Orders — list page
- [x] Account/Orders/[id] — full order detail page (items, status, payment, address)
- [x] Account/Wishlist
- [x] Account/Notifications — rich UI with notification cards (currently MOCK data)
- [x] Account/Settings — UI shell with toggles (notifications, privacy)

### Functionality
- [x] Auth: login, register, guest checkout, JWT refresh rotation, forgot/reset password
- [x] Cart events for cross-component sync (`voltex:cart-updated`)
- [x] Razorpay payment flow with HMAC verification
- [x] Coupon code validation at checkout
- [x] Product reviews submission + display with rating breakdown
- [x] Responsive design (mobile-first, navbar with mega-menu + mobile drawer)
- [x] Image remote patterns for unsplash, placeholder.com, supabase

## ⏳ What's Planned

### 🔴 Critical
- [ ] **Fix production deployment** — `NEXT_PUBLIC_API_URL` is set; needs CORS on server (`CLIENT_URL` env on Vercel server project) before client can reach API
- [ ] **Replace mock notifications with real API** — server needs notifications endpoint first
- [ ] **Wire Settings save handlers** — toggles currently don't persist anywhere

### 🟠 Important UX
- [ ] **Search autocomplete** — currently hardcoded mock (trending/recent) in `SearchSuggestions.tsx`
- [ ] **Recently viewed products** carousel on home/category pages
- [ ] **Order tracking timeline** UI on order detail (PENDING → CONFIRMED → SHIPPED → DELIVERED visual)
- [ ] **Pincode / delivery availability** check on product page
- [ ] **Dark/light mode toggle UI** — `next-themes` installed, just needs a switcher in navbar/settings
- [ ] **Voice search** — mic icon is currently UI-only

### 🟡 Nice to have
- [ ] Product comparison (compare 2-4 products side by side)
- [ ] Share product (Web Share API on mobile, copy link on desktop)
- [ ] EMI calculator on product page
- [ ] Social login (Google OAuth)
- [ ] PWA support (manifest + service worker for offline shell)
- [ ] sitemap.xml / robots.txt generation
- [ ] Replace hardcoded mock data in home sections (DealsOfDay, UnboxedBlog, BrandsCarousel) with real CMS/API data
- [ ] Loading skeletons (replace spinners on product/category pages)
- [ ] Empty state illustrations (e.g., "No products match these filters")
