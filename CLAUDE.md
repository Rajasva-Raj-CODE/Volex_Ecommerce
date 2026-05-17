@AGENTS.md

# VolteX E-Commerce — Monorepo

## Overview

Full-stack electronics e-commerce platform (inspired by Croma / Reliance Digital). TypeScript monorepo with four packages — customer storefront, admin dashboard, REST API server, and mobile app (planned).

**Current State (May 2026):** Server APIs 100% complete (14 modules, 13 Prisma models). Client storefront fully wired with real APIs across all customer flows. Admin dashboard fully wired across all 11 pages. Live deployments on Vercel. Mobile not started.

## Monorepo Structure

```
Volex_Ecommerce/
├── client/       # Customer storefront — Next.js 16 (App Router, React 19)    → :3000
├── admin/        # Admin dashboard    — Vite 8 + React 19 + React Router 7    → :3002
├── server/       # REST API           — Express 4 + Prisma + PostgreSQL       → :8000
├── mobile/       # Mobile app         — React Native + Expo (scaffolded only)
├── postman/      # Postman collections for API testing
├── .github/      # CI/CD (GitHub Actions — lint + build on PRs)
├── AGENTS.md     # Development guidelines & coding conventions
└── CLAUDE.md     # This file (Built vs Planned features tracked here)
```

Each package is independent — separate `package.json`, separate build, separate deployment. No shared workspace root.

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Client | Next.js 16.2, React 19, Tailwind CSS 4, shadcn/ui, Embla Carousel |
| Admin | Vite 8, React 19, React Router 7, Tailwind CSS 4, shadcn/ui, TanStack Table, Recharts |
| Server | Express 4.21, Prisma 5.22, PostgreSQL, JWT, bcrypt, Zod, Resend |
| Storage | Supabase Storage (product/category images) |
| Payments | Razorpay (test mode — INR currency) |
| Email | Resend (staff invites, OTP, password reset, order confirmation, order status updates) |
| Deployment | Vercel (all packages) |

## Commands (run inside each package directory)

```bash
# Server
cd server && npm run dev          # Express dev server with tsx watch
cd server && npm run build        # TypeScript compilation to /dist
cd server && npm run db:migrate   # Run Prisma migrations
cd server && npm run db:seed      # Seed admin user
cd server && npm run db:studio    # Open Prisma Studio GUI

# Client
cd client && npm run dev          # Next.js dev server
cd client && npm run build        # Production build

# Admin
cd admin && npm run dev           # Vite dev server
cd admin && npm run build         # Production build

# All packages
npm run lint                      # ESLint (run per package)
```

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Client     │     │    Admin     │     │   Mobile     │
│  Next.js 16  │     │  Vite+React  │     │ React Native │
│  :3000       │     │  :3002       │     │  (planned)   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                     │
       │         REST API + JWT Auth              │
       └────────────────┬─────────────────────────┘
                        │
                ┌───────▼────────┐
                │    Server      │
                │  Express API   │
                │  :8000         │
                └───────┬────────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
   ┌──────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
   │ PostgreSQL  │ │Supabase│ │  Razorpay  │
   │ (Prisma)    │ │Storage │ │  Payments  │
   └─────────────┘ └────────┘ └────────────┘
```

## Database Models (Prisma) — 13 models

| Model | Purpose |
|-------|---------|
| User | Admin/Staff/Customer with roles, email, passwordHash, phone, avatar |
| Invitation | Staff email invitations (admin creates, staff uses OTP to login) |
| OtpSession | Time-limited OTP for staff login AND password reset (15min, bcrypt hashed) |
| RefreshToken | JWT refresh token rotation (SHA256 hashed) |
| Category | Hierarchical (self-referencing parentId), 3-level tree |
| Product | Full product with images[], variants, specs, bankOffers (JSON fields), rating + reviewCount aggregate |
| CartItem | Per-user cart items (unique userId+productId) |
| WishlistItem | Per-user wishlist (unique userId+productId) |
| Address | Multiple per user, default flag, used in orders |
| Order | With status flow, payment tracking, Razorpay fields, couponCode + discountAmount |
| OrderItem | Line items with price-at-purchase snapshot |
| Coupon | Promo codes (PERCENTAGE or FIXED discount, min order, max uses, expiry) |
| Review | Product reviews + ratings (1-5 stars, status moderation, user + product FKs) |

**Enums:** `Role` (ADMIN/STAFF/CUSTOMER), `OtpPurpose` (STAFF_LOGIN/RESET_PASSWORD), `DiscountType` (PERCENTAGE/FIXED), `OrderStatus` (PENDING→CONFIRMED→SHIPPED→DELIVERED, CANCELLED), `PaymentStatus` (PENDING/PAID/FAILED/REFUNDED)

**Roles:** `ADMIN` (full access), `STAFF` (products/categories/orders, no customer/team/settings), `CUSTOMER` (shopping)

## API Endpoints (14 modules, 45+ routes)

| Module | Routes | Auth |
|--------|--------|------|
| Auth | login, refresh, logout, me, customer/register, customer/login, forgot-password, reset-password | Public/Auth |
| Invitations | CRUD + OTP request/verify | Admin/Public |
| Products | list (with filters/search/pagination), get, create, update, delete | Public/Admin+Staff |
| Categories | tree, flat, admin-paginated, get, create, update, delete | Public/Admin |
| Cart | get, add, update quantity, remove, clear | Customer |
| Wishlist | get, add, remove | Customer |
| Addresses | list, create, update, delete | Customer |
| Orders | place (with stock tx + email), my orders, get, list all, update status (with email) | Customer/Admin+Staff |
| Payments | create Razorpay order, verify signature | Customer |
| Uploads | image upload to Supabase | Admin+Staff |
| Users | list customers, update profile, change password | Auth/Admin+Staff |
| Dashboard | summary analytics | Admin+Staff |
| Coupons | validate (customer), CRUD (admin) | Customer/Admin |
| Reviews | list by product (public), create (customer), moderate + delete (admin) | Public/Customer/Admin |

## Authentication Flows

1. **Admin login:** email + password → JWT access (15m) + refresh (7d) tokens
2. **Customer login:** email + password → same JWT flow
3. **Customer register:** email + password + name → auto-login
4. **Guest checkout:** auto-generated credentials on client
5. **Staff login:** admin invites by email → staff requests OTP → verifies OTP → JWT tokens
6. **Token refresh:** automatic rotation, old token invalidated

## Environment Variables

Each package has `.env.example`. Key variables:
- **Server:** `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `RESEND_API_KEY`, `SUPABASE_*`, `RAZORPAY_*`, `CLIENT_URL`, `ADMIN_URL`
- **Client:** `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- **Admin:** `VITE_API_URL`, `VITE_SUPABASE_*`

## ✅ What's Built (production-ready)

### Server (all 14 modules implemented)
- [x] Auth — admin login, customer register/login, JWT access + refresh rotation, **forgot-password + reset-password (OTP-based)**
- [x] Staff invitations + OTP login flow
- [x] Products — full CRUD + filters (category, brand, price range, in-stock), search, pagination, sort
- [x] Categories — tree + flat + admin views, CRUD with cascade protection
- [x] Cart — add/update/remove/clear, atomic operations
- [x] Wishlist — list/add/remove
- [x] Addresses — CRUD with default flag
- [x] Orders — atomic stock tx (no overselling), customer + admin views, status transitions, **confirmation + status update emails**
- [x] Payments — Razorpay order creation + HMAC signature verification
- [x] Uploads — Supabase Storage (JPEG/PNG/WebP/GIF, 5MB cap)
- [x] Users — list customers, **update profile (name/phone/avatar), change password**
- [x] Dashboard — admin + staff summary analytics
- [x] **Coupons — validate at checkout, admin CRUD (PERCENTAGE/FIXED, min order, max uses, expiry)**
- [x] **Reviews — list by product, customer create, admin moderation + delete, rating aggregation on Product**
- [x] Rate limiting (general/auth/OTP), Helmet, CORS, Zod validation
- [x] Email service — staff invite, OTP, password reset, order confirmation, order status updates

### Client storefront (all routes wired with real APIs)
- [x] Home — hero, category slider, bank offers, multiple product showcases, brands
- [x] Search — query, filters, pagination
- [x] Category + subcategory listing pages
- [x] Product detail — gallery, specs, variants, bank offers, **reviews + submit modal**, related products
- [x] Cart — add/update/remove, subtotal
- [x] Checkout — address selection, **coupon apply**, Razorpay integration, success page
- [x] Login — admin/customer login, customer register, **forgot password OTP flow, reset password**
- [x] My Account hub
- [x] Account/Profile — view + edit
- [x] Account/Address — CRUD with default flag
- [x] Account/Orders — list page + **detail page** with items, status, payment, address
- [x] Account/Wishlist
- [x] Account/Notifications — UI built (currently mock data — needs server notifications API)
- [x] Account/Settings — UI shell (handlers not wired yet)

### Admin dashboard (all 11 pages wired)
- [x] Login — admin email/password + staff OTP flow
- [x] Dashboard — KPI cards, recent orders, role-aware (admin vs staff view)
- [x] Products — list with search/filter/pagination, add, edit (with image uploads + JSON editors)
- [x] Categories — tree CRUD with image uploads
- [x] Orders — list with inline status updates, expandable detail sheet
- [x] Customers — list with search/filter
- [x] Team — staff invitations (send via Resend, list, revoke)
- [x] **Coupons — full CRUD with discount type, min order, max uses, expiry**
- [x] **Reviews — list all reviews, moderation (approve/reject), delete**
- [x] Settings — password change + theme picker wired (store info handlers partial)

### Infrastructure
- [x] Vercel deployments for server, client, admin
- [x] CI/CD (GitHub Actions — lint + build on PRs)
- [x] 5 Prisma migrations (init, customer role, order payment fields, product detail fields, phase1 features)

## ⏳ What's Planned (not built yet)

### 🔴 Critical (next sprint)
- [ ] **Fix production deployment** — set `CLIENT_URL` + `ADMIN_URL` + `NODE_ENV=production` on Vercel server project (currently CORS-blocked)
- [ ] **Razorpay webhook handler** — refunds, disputes, async payment state sync
- [ ] **Client notifications API** — replace mock data with real notifications (order updates, price drops)
- [ ] **Client settings save handlers** — wire toggles to backend preferences
- [ ] **Admin Settings store info handlers** — wire remaining sections to API

### 🟠 Important (user experience)
- [ ] Search suggestions/autocomplete API + UI
- [ ] Recently viewed products tracking
- [ ] Order tracking timeline UI on order detail
- [ ] Pincode / delivery availability check
- [ ] Admin order detail page (full page, not just sheet)
- [ ] Admin dashboard chart with time-range picker (7d/30d/90d/1y)
- [ ] Bulk operations in admin (CSV export, bulk status update)
- [ ] Dark/light mode toggle UI on client (`next-themes` already installed)
- [ ] Staff role editing / deactivation (currently invite-only)

### 🟡 Nice to have
- [ ] Social login (Google OAuth)
- [ ] Product comparison
- [ ] EMI calculator
- [ ] Real-time admin notifications (SSE)
- [ ] Audit log for admin actions
- [ ] Share product (Web Share API)
- [ ] PWA support on client
- [ ] sitemap.xml / robots.txt

### 🔧 Infrastructure
- [ ] **Error tracking (Sentry)** on all 3 packages
- [ ] **Automated test suite (Vitest)** — start with order placement transaction + auth flows
- [ ] Production monitoring & alerts
- [ ] Database backup automation
- [ ] CDN/caching strategy
- [ ] Docker / docker-compose for local dev

### 📱 Mobile (not started)
- [ ] React Native + Expo app — currently only scaffolded with placeholder `index.ts`

## Git Workflow

- `main` — stable, production-ready
- `dev` — active development branch
- Feature branches: `feature/*`, `fix/*`, `chore/*`
- Conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`
- PRs with summary, screenshots for UI, curl examples for API

## Coding Conventions

- TypeScript strict mode across all packages
- React components: PascalCase files, `"use client"` directive for interactive components
- API modules: `{feature}.routes.ts`, `{feature}.controller.ts`, `{feature}.service.ts`, `{feature}.schema.ts`
- Validation: Zod schemas on server, client-side form validation
- Styling: Tailwind CSS 4 with `cn()` helper (clsx + tailwind-merge)
- UI components: shadcn/ui (do not manually edit `components/ui/`)
- Error handling: `AppError` class on server, `ApiError` class on clients
- API responses: `{ success, message, data?, errors? }` format
- No `console.log` in production code — use proper error handling
- Do not edit `server/dist/` — it's generated output
