@AGENTS.md

# VolteX E-Commerce — Monorepo

## Overview

Full-stack electronics e-commerce platform (inspired by Croma / Reliance Digital). TypeScript monorepo with four packages — customer storefront, admin dashboard, REST API server, and mobile app (planned).

**Current State (May 2025):** Server APIs 100% complete. Client and Admin ~85-90% integrated with real APIs. Mobile not started.

## Monorepo Structure

```
Volex_Ecommerce/
├── client/       # Customer storefront — Next.js 16 (App Router, React 19)    → :3000
├── admin/        # Admin dashboard    — Vite 8 + React 19 + React Router 7    → :3002
├── server/       # REST API           — Express 4 + Prisma + PostgreSQL       → :8000
├── mobile/       # Mobile app         — React Native + Expo (scaffolded only)
├── postman/      # Postman collections for API testing
├── .github/      # CI/CD (GitHub Actions — lint + build on PRs)
├── TRACKER.md    # Feature tracker (NOTE: partially outdated)
├── AGENTS.md     # Development guidelines & coding conventions
└── CLAUDE.md     # This file
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
| Email | Resend (staff invitations + OTP emails) |
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

## Database Models (Prisma)

| Model | Purpose |
|-------|---------|
| User | Admin/Staff/Customer with roles, email, passwordHash |
| Invitation | Staff email invitations (admin creates, staff uses OTP to login) |
| OtpSession | Time-limited OTP for staff authentication (15min, bcrypt hashed) |
| RefreshToken | JWT refresh token rotation (SHA256 hashed) |
| Category | Hierarchical (self-referencing parentId), 3-level tree |
| Product | Full product with images[], variants, specs, bankOffers (JSON fields) |
| CartItem | Per-user cart items (unique userId+productId) |
| WishlistItem | Per-user wishlist (unique userId+productId) |
| Address | Multiple per user, default flag, used in orders |
| Order | With status flow, payment tracking, Razorpay fields |
| OrderItem | Line items with price-at-purchase snapshot |

**Roles:** `ADMIN` (full access), `STAFF` (products/categories/orders), `CUSTOMER` (shopping)

## API Endpoints (35+ routes)

| Module | Routes | Auth |
|--------|--------|------|
| Auth | login, refresh, logout, me, customer/register, customer/login | Public/Auth |
| Invitations | CRUD + OTP request/verify | Admin/Public |
| Products | list (with filters/search/pagination), get, create, update, delete | Public/Admin+Staff |
| Categories | tree, flat, admin-paginated, get, create, update, delete | Public/Admin |
| Cart | get, add, update quantity, remove, clear | Customer |
| Wishlist | get, add, remove | Customer |
| Addresses | list, create, update, delete | Customer |
| Orders | place (with stock tx), my orders, get, list all, update status | Customer/Admin+Staff |
| Payments | create Razorpay order, verify signature | Customer |
| Uploads | image upload to Supabase | Admin+Staff |
| Dashboard | summary analytics | Admin+Staff |

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

## What's Complete

- All server APIs (auth, products, categories, cart, wishlist, orders, payments, uploads, dashboard)
- Client storefront (home, categories, product detail, cart, checkout, orders, wishlist, addresses, profile)
- Admin panel (dashboard, products CRUD, categories CRUD, orders management, customers, team invitations)
- Razorpay payment integration (test mode)
- Supabase image uploads
- Email notifications (staff invite + OTP)
- JWT auth with refresh token rotation
- Role-based access control
- Rate limiting & security headers
- CI/CD pipeline (GitHub Actions — lint + build)

## What's Missing for Full Production

### Critical (Core E-Commerce)
- [ ] Forgot password / password reset flow (server + client + admin)
- [ ] Customer profile update API (name, phone, avatar)
- [ ] Order confirmation emails (post-purchase)
- [ ] Shipping status update emails
- [ ] Coupon/promo code system (server API + client/admin UI)
- [ ] Product reviews & ratings (server API + client submission UI)
- [ ] Order detail page on client (currently list-only)
- [ ] Admin order detail modal/page

### Important (User Experience)
- [ ] Search suggestions/autocomplete API
- [ ] Recently viewed products tracking
- [ ] Client notifications page (currently placeholder)
- [ ] Client settings page (currently placeholder)
- [ ] Admin settings page handlers (UI built, not wired)
- [ ] Admin dashboard chart with real time-range data
- [ ] Dark/light mode toggle on client (next-themes installed, no UI)
- [ ] Pincode/delivery availability check
- [ ] Bulk operations in admin (export CSV, bulk status update)

### Nice to Have (Enhancement)
- [ ] Social login (Google OAuth)
- [ ] Product comparison feature
- [ ] EMI calculator
- [ ] Razorpay webhook handler (refunds, disputes)
- [ ] Real-time admin notifications
- [ ] Audit log for admin actions
- [ ] Staff role editing/deactivation (currently invite-only)
- [ ] sitemap.xml / robots.txt generation
- [ ] PWA support on client
- [ ] Share product functionality

### Infrastructure
- [ ] Docker / docker-compose setup
- [ ] Automated test suite (Jest/Vitest)
- [ ] Error tracking (Sentry)
- [ ] Production monitoring & alerts
- [ ] Database backup automation
- [ ] CDN/caching strategy

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
