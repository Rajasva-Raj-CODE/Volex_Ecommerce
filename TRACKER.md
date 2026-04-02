# VolteX — Feature Tracker

> Status: `[ ]` planned · `[~]` in-progress · `[x]` done · `[-]` removed/cancelled
>
> Updated every time a feature is built or changed.
> Each entry has the package tag and the key file path.

---

## SERVER (`server/`)

### Foundation
- [x] Express app setup · `server/src/app.ts`, `server/src/index.ts`
- [x] Environment config (Zod-validated) · `server/src/config/env.ts`
- [x] Prisma client singleton · `server/src/config/prisma.ts`
- [x] Global error handler · `server/src/middleware/error.middleware.ts`
- [x] Zod request validator · `server/src/middleware/validate.middleware.ts`
- [x] Rate limiter (general + auth + OTP) · `server/src/middleware/rateLimiter.ts`
- [x] Vercel deployment config · `server/vercel.json`
- [x] .env.example · `server/.env.example`

### Database
- [x] Prisma schema — User, Invitation, OtpSession, RefreshToken, Product, Category, CartItem, WishlistItem, Address, Order, OrderItem · `server/prisma/schema.prisma`
- [x] Admin seed script · `server/prisma/seed.ts`
- [ ] Migration run (manual — copy `.env.example` → `.env`, fill DATABASE_URL + DIRECT_URL, then run `npm run db:migrate`)

### Utils
- [x] JWT utils (signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken) · `server/src/utils/jwt.ts`
- [x] OTP utils (generateOtp, hashOtp, verifyOtp, otpExpiresAt) · `server/src/utils/otp.ts`
- [x] Response helpers (success, error) · `server/src/utils/response.ts`

### Email Service
- [x] Resend email wrapper · `server/src/services/email.service.ts`
- [x] Staff invitation email template (branded HTML)
- [x] OTP login email template (branded HTML with large OTP code)

### Auth Module
- [x] Admin login (email + password) · `server/src/modules/auth/auth.service.ts`
- [x] POST /api/auth/login · `server/src/modules/auth/auth.routes.ts`
- [x] POST /api/auth/refresh (token rotation)
- [x] POST /api/auth/logout (invalidates refresh token)
- [x] GET /api/auth/me
- [x] Auth middleware (JWT verify → req.user) · `server/src/middleware/auth.middleware.ts`
- [x] Role guard middleware (requireRole) · `server/src/middleware/requireRole.middleware.ts`

### Invitations + Staff OTP Module
- [x] POST /api/invitations (admin invites staff by email) · `server/src/modules/invitations/`
- [x] GET /api/invitations (list all invitations — admin only)
- [x] DELETE /api/invitations/:id (revoke invitation — admin only)
- [x] POST /api/invitations/auth/request-otp (staff requests OTP — rate limited 5/15min)
- [x] POST /api/invitations/auth/verify-otp (staff enters OTP → JWT tokens)

### Products API
- [x] GET /api/products (list + search + filter by category/brand/price/stock + paginate) · `server/src/modules/products/`
- [x] GET /api/products/:id (by id or slug)
- [x] POST /api/products (ADMIN/STAFF — auto-generates slug)
- [x] PUT /api/products/:id (partial update)
- [x] DELETE /api/products/:id (ADMIN only)

### Categories API
- [x] GET /api/categories (tree — 3 levels deep) · `server/src/modules/categories/`
- [x] GET /api/categories/flat (flat list for dropdowns)
- [x] GET /api/categories/:id
- [x] POST /api/categories (ADMIN only — supports parent/child)
- [x] PUT /api/categories/:id
- [x] DELETE /api/categories/:id (blocked if has products or children)

### Cart API
- [x] GET /api/cart (with subtotal + item count) · `server/src/modules/cart/`
- [x] POST /api/cart (add item — upsert by productId)
- [x] PUT /api/cart/:productId (update quantity)
- [x] DELETE /api/cart/:productId (remove item)
- [x] DELETE /api/cart/clear (clear entire cart)

### Wishlist API
- [x] GET /api/wishlist · `server/src/modules/wishlist/`
- [x] POST /api/wishlist (add product)
- [x] DELETE /api/wishlist/:productId

### Orders API
- [x] POST /api/orders (place order — validates stock, decrements stock, clears cart, runs in transaction) · `server/src/modules/orders/`
- [x] GET /api/orders/my (user's own orders)
- [x] GET /api/orders/:id (user sees own, admin/staff see any)
- [x] GET /api/orders (all orders — admin/staff only, filterable by status/userId)
- [x] PUT /api/orders/:id/status (admin/staff update status)

---

## ADMIN (`admin/`)

### Auth
- [x] Login page UI · `admin/src/pages/Login.tsx`
- [x] Auth context (mock) · `admin/src/lib/auth-context.tsx`
- [x] Protected route HOC · `admin/src/components/auth/ProtectedRoute.tsx`
- [x] Role guard HOC · `admin/src/components/auth/RequireRole.tsx`
- [ ] Real JWT login (replace mock) · `admin/src/lib/auth-context.tsx`
- [ ] OTP login tab for staff · `admin/src/pages/Login.tsx`
- [ ] Persist auth with access + refresh tokens

### Dashboard
- [x] Dashboard page UI · `admin/src/pages/Dashboard.tsx`
- [x] KPI stat cards · `admin/src/components/section-cards.tsx`
- [x] Interactive area chart · `admin/src/components/chart-area-interactive.tsx`
- [ ] Real analytics from server

### Products
- [x] Products list page UI · `admin/src/pages/Products.tsx`
- [x] Add product form UI · `admin/src/pages/AddProduct.tsx`
- [x] Edit product form UI · `admin/src/pages/EditProduct.tsx`
- [ ] Wire to real product API

### Categories
- [x] Categories page UI · `admin/src/pages/Categories.tsx`
- [ ] Wire to real categories API

### Orders
- [x] Orders page UI · `admin/src/pages/Orders.tsx`
- [ ] Wire to real orders API

### Customers
- [x] Customers page UI · `admin/src/pages/Customers.tsx`
- [ ] Wire to real users API

### Team (Invite Staff)
- [x] Team page UI · `admin/src/pages/Team.tsx`
- [ ] Invite staff (POST /api/invitations) · `admin/src/pages/Team.tsx`
- [ ] List invitations
- [ ] Revoke invitation

### Settings
- [x] Settings page UI · `admin/src/pages/Settings.tsx`

---

## CLIENT (`client/`)

### Auth
- [x] Login page UI · `client/app/login/page.tsx`
- [x] Auth context (mock) · `client/contexts/AuthContext.tsx`
- [ ] Real JWT auth (replace mock)
- [ ] Register flow wired to API
- [ ] Persist login with localStorage + refresh token

### Home
- [x] Hero carousel · `client/components/home/HeroSection.tsx`
- [x] Category slider · `client/components/home/CategorySlider.tsx`
- [x] Deals of day · `client/components/home/DealsOfDay.tsx`
- [x] Product showcase · `client/components/home/ProductShowcase.tsx`
- [x] Brands carousel · `client/components/home/BrandsCarousel.tsx`
- [x] Bank offers · `client/components/home/BankOffers.tsx`
- [ ] Real data from API

### Product Listing
- [x] Category page with filters · `client/app/category/[categorySlug]/page.tsx`
- [x] Subcategory page · `client/app/category/[categorySlug]/[subcategorySlug]/page.tsx`
- [x] Product card component · `client/components/product/ProductCard.tsx`
- [x] Filters UI · `client/components/product/ProductFilters.tsx`
- [ ] Real products from API

### Product Detail
- [x] Product detail page · `client/app/product/[productSlug]/page.tsx`
- [ ] Real product data from API

### Cart
- [x] Cart page UI · `client/app/cart/page.tsx`
- [ ] Cart synced to server API

### Account
- [x] Profile page · `client/app/(account)/profile/page.tsx`
- [x] Orders page · `client/app/(account)/orders/page.tsx`
- [x] Wishlist page · `client/app/(account)/wishlist/page.tsx`
- [x] Address page · `client/app/(account)/address/page.tsx`
- [x] Notifications page · `client/app/(account)/notifications/page.tsx`
- [x] Settings page · `client/app/(account)/settings/page.tsx`
- [ ] All account pages wired to real API

---

## MOBILE (`mobile/`)

### Setup
- [ ] React Native + Expo project setup · `mobile/`
- [ ] Shared API client (typed fetch wrapper)
- [ ] Navigation setup (React Navigation)

### Screens
- [ ] Home screen
- [ ] Product listing screen
- [ ] Product detail screen
- [ ] Cart screen
- [ ] Checkout screen
- [ ] Orders screen
- [ ] Profile screen
- [ ] Login screen (OTP)

### Features
- [ ] Push notifications (Expo Notifications)
- [ ] Offline support
- [ ] App Store + Play Store deployment config

---

## DEPLOYMENT

### Server
- [ ] `vercel.json` configured · `server/vercel.json`
- [ ] Vercel Postgres connected (DATABASE_URL + DIRECT_URL)
- [ ] All env vars set in Vercel dashboard
- [ ] Deployed to Vercel

### Admin
- [ ] Build tested (`npm run build`)
- [ ] Deployed to Vercel as static site

### Client
- [ ] Deployed to Vercel (Next.js native)

### Mobile
- [ ] EAS Build configured
- [ ] App Store submission
- [ ] Play Store submission

---

*Last updated: Chunks 1–13 — ALL server APIs complete. Cart, Wishlist, Orders done. TypeScript: 0 errors.*
