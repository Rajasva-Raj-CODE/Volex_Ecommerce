# VolteX E-Commerce — Complete Project Walkthrough

> A single document explaining what this project is, how it's built, and how every piece fits together.
> Read this top-to-bottom and you'll be able to explain VolteX to anyone — from a recruiter to a new developer.

---

## 1. What Is VolteX?

VolteX is a **full-stack electronics e-commerce platform** inspired by Croma and Reliance Digital. It's the kind of site where a customer can browse smartphones, TVs, laptops, and home appliances, add them to a cart, apply a coupon, pay with Razorpay, and track the order — while admins manage products, orders, customers, and staff from a separate dashboard.

**One-line pitch:** "A production-grade Indian electronics marketplace with a customer storefront, an admin dashboard, and a REST API backend — all written in TypeScript and deployed on Vercel."

### Who uses it?

| User Type | What They Do | Where They Log In |
|-----------|--------------|-------------------|
| **Customer** | Browse, search, add to cart, checkout, track orders, write reviews | Client storefront (`:3000`) |
| **Admin** | Manage everything — products, orders, coupons, customers, staff | Admin dashboard (`:3002`) |
| **Staff** | Manage products, categories, orders (no customer/team access) | Admin dashboard (`:3002`) via OTP |

---

## 2. The Big Picture (Architecture)

```
┌──────────────────┐     ┌──────────────────┐
│   Customer       │     │   Admin / Staff  │
│   (web browser)  │     │   (web browser)  │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         │ HTTPS                  │ HTTPS
         ▼                        ▼
┌──────────────────┐     ┌──────────────────┐
│  Next.js Client  │     │  Vite + React    │
│  Server-rendered │     │  SPA Admin       │
│  React App       │     │  Dashboard       │
│  (Vercel)        │     │  (Vercel)        │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         │  REST API + JWT        │
         └────────┬───────────────┘
                  │
                  ▼
        ┌──────────────────┐
        │  Express.js API  │
        │  (Vercel         │
        │   serverless)    │
        └────────┬─────────┘
                 │
       ┌─────────┼──────────┬─────────────┐
       ▼         ▼          ▼             ▼
   ┌───────┐ ┌───────┐ ┌─────────┐ ┌──────────┐
   │Postgres│ │Supabase│ │Razorpay │ │  Resend  │
   │ +Prisma│ │Storage │ │Payments │ │  Email   │
   └────────┘ └────────┘ └─────────┘ └──────────┘
```

### Why 3 separate apps instead of one?

| Concern | Reason |
|---------|--------|
| **Different audiences** | Customer-facing pages need SEO + fast initial load (Next.js SSR shines). Admin doesn't need SEO — it needs fast interaction (Vite SPA shines). |
| **Different deploy cadence** | You can update the admin panel without touching the customer site, and vice versa. |
| **Different security models** | Admin URL is unguessable, customer URL is public. They can have different CORS rules, different rate limits. |
| **Smaller bundles** | A customer never downloads the admin code. An admin never downloads marketing pages. |

---

## 3. Tech Stack (and Why Each Was Chosen)

### Server (`/server`)
| Tech | Version | Why |
|------|---------|-----|
| **Express.js** | 4.21 | Minimal, battle-tested, huge ecosystem. Works perfectly on Vercel serverless. |
| **TypeScript** | 5.6 | Catch bugs at compile time, self-documenting code. |
| **Prisma ORM** | 5.22 | Type-safe DB queries; auto-generates client from schema; great migrations. |
| **PostgreSQL** | — | Industry standard. Supports complex relationships, JSON fields (for product variants/specs), transactions (critical for atomic order placement). |
| **Zod** | 3.23 | Runtime validation of request bodies — single source of truth for shape + types. |
| **JWT** (jsonwebtoken) | 9.0 | Stateless auth. Easy to scale across serverless instances. |
| **bcryptjs** | 2.4 | Password hashing (12 rounds for customers, 10 for OTPs). |
| **Helmet + CORS + Rate Limiting** | — | Security headers, origin whitelist, brute-force protection. |
| **Resend** | 4.0 | Modern transactional email service — better DX than SendGrid/Mailgun. |
| **Razorpay** | HTTPS API | Indian payment gateway — supports UPI, cards, netbanking, wallets. |
| **Supabase Storage** | HTTPS API | S3-compatible object storage with public CDN URLs. Free tier sufficient for now. |

### Client (`/client`)
| Tech | Version | Why |
|------|---------|-----|
| **Next.js** (App Router) | 16.2 | SEO via server-side rendering, image optimization, automatic code splitting. |
| **React** | 19 | Industry standard UI library. |
| **Tailwind CSS** | 4 | Utility-first CSS; no class-name brainstorming; small bundles. |
| **shadcn/ui** | — | Copy-paste Radix-based components — accessible, themeable, owned-by-us (not a brittle dependency). |
| **Embla Carousel** | — | Smooth, accessible carousels for product showcases. |

### Admin (`/admin`)
| Tech | Version | Why |
|------|---------|-----|
| **Vite** | 8 | Lightning-fast dev server with HMR. No SEO needed, so no Next.js overhead. |
| **React Router 7** | — | Client-side routing for SPA navigation. |
| **TanStack Table** | 8 | Headless data tables with sorting, filtering, pagination. |
| **Recharts** | 3 | Composable chart library for dashboard analytics. |

### Infrastructure
- **Vercel** — Hosts all 3 apps. Auto-deploys from Git. Free tier handles current load.
- **GitHub Actions** — Runs lint + build on every PR.

---

## 4. Project Structure (Monorepo)

```
Volex_Ecommerce/
├── client/       Customer storefront      Next.js 16   :3000
├── admin/        Admin dashboard          Vite + React :3002
├── server/       REST API                 Express 4    :8000
├── mobile/       Mobile app (scaffold)    React Native (planned)
├── postman/      API testing collections
├── .github/      CI/CD pipelines
├── AGENTS.md     Developer onboarding
└── CLAUDE.md     AI assistant context
```

Each package is **independent** — own `package.json`, own build, own deployment. No shared workspace. This means a server change never breaks a client build, and you can hand off any package to a new team.

---

## 5. Database Design

### Why PostgreSQL?
- Complex relations (orders → users → addresses → items → products → reviews → categories)
- ACID transactions (critical for atomic order placement — must decrement stock + create order + clear cart all-or-nothing)
- JSON fields for flexible product attributes (variants, specs, bank offers)
- Production-grade with free managed tiers

### The 13 Models

```
                   ┌────────────────────────────┐
                   │           User             │
                   │  (ADMIN / STAFF / CUSTOMER)│
                   └──┬──────┬──────┬──────┬────┘
                      │      │      │      │
              ┌───────┘      │      └──┐   └────────┐
              ▼              ▼         ▼            ▼
         CartItem       WishlistItem  Address    Order ──── OrderItem
                                                    │           │
                                                    │           ▼
                                                    ▼        Product ◄──── Review
                                                 (couponCode,    │
                                                 discountAmount) │
                                                                 ▼
                                                             Category
                                                          (self-referencing
                                                           parent → children)

         Coupon       (validated at checkout, applied to Order)
         OtpSession   (STAFF_LOGIN or RESET_PASSWORD)
         RefreshToken (JWT rotation, SHA256-hashed)
         Invitation   (staff onboarding by email)
```

### Why these specific models?

| Model | Reason for existing |
|-------|---------------------|
| **User** | One table for all roles (ADMIN/STAFF/CUSTOMER). Distinguished by `role` enum. Customers have `passwordHash`; staff don't (they use OTP). |
| **Invitation** | Admin can invite staff by email. Email is unique key — one active invite per email. |
| **OtpSession** | Temporary 6-digit codes for staff login AND password reset. Hashed with bcrypt, 15-min expiry. |
| **RefreshToken** | Stored as SHA256 hash in DB. When used, old token is invalidated and a new one issued (token rotation = defense against token replay attacks). |
| **Category** | Hierarchical (self-referencing `parentId`). Supports 3-level tree like "Mobiles → Smartphones → Apple". |
| **Product** | Rich fields including JSON for `variants`, `specGroups`, `bankOffers`. Avoids creating dozens of side tables for things that vary per product. |
| **CartItem / WishlistItem** | Unique on `(userId, productId)` — can't have duplicates. Cart is per-user, not per-session, so it persists across devices. |
| **Address** | Multiple per user. `isDefault` flag picks the default for checkout. |
| **Order + OrderItem** | Two tables — Order holds totals/status/payment info, OrderItems are line items with **price-at-purchase snapshot** (so price changes after the sale don't rewrite history). |
| **Coupon** | Standalone. Validates against cart subtotal at checkout. `discountType` is PERCENTAGE or FIXED. Has `maxUses`, `minOrderAmount`, `expiresAt`. |
| **Review** | Per-product reviews with 1-5 star rating. Admin moderates (PENDING → APPROVED/REJECTED). Aggregate `rating` + `reviewCount` cached on Product for fast reads. |

---

## 6. Authentication — Three Different Flows

This is the trickiest part of the system. There are **three different login flows** because there are three different user types with different security needs.

### Flow 1 — Customer Login (Email + Password)

```
1. Customer types email + password on /login page
2. Client POSTs to /api/auth/customer/login
3. Server:
   - Look up User by email
   - bcrypt.compare(password, user.passwordHash)
   - If valid: sign accessToken (15min) + refreshToken (7d)
   - Save SHA256 hash of refreshToken in DB
   - Return both tokens
4. Client stores tokens in localStorage:
     voltex_access_token, voltex_refresh_token
5. All future requests include: Authorization: Bearer <accessToken>
6. When accessToken expires (15min later):
   - Client auto-calls /api/auth/refresh with refreshToken
   - Server invalidates old refreshToken, issues new pair
   - Client retries the original request transparently
```

### Flow 2 — Admin Login (Email + Password)

Same as customer flow but hits `/api/auth/login` (admin endpoint). Only difference: requires `role === "ADMIN"`. Tokens are stored under different localStorage keys (`voltex_admin_*`) so an admin can also be logged in as a customer simultaneously without conflict.

### Flow 3 — Staff Login (OTP Only)

Staff members **never have a password**. The flow is:

```
1. Admin invites staff via /api/invitations with their email
2. Server creates Invitation row + sends email via Resend
3. Staff opens admin panel /login, clicks "Staff Login"
4. Staff enters their email → POST /api/invitations/auth/request-otp
5. Server:
   - Checks an Invitation exists for this email
   - Generates random 6-digit OTP
   - Stores bcrypt hash in OtpSession (15-min expiry)
   - Sends OTP email via Resend
6. Staff enters OTP from email → POST /api/invitations/auth/verify-otp
7. Server:
   - Looks up OtpSession by email
   - bcrypt.compare(submitted OTP, stored hash)
   - If valid: marks OTP as used, marks Invitation as used
   - Creates or updates User with role=STAFF
   - Issues JWT tokens (same as customer/admin flow)
```

**Why no password for staff?** Removes a class of attacks (credential stuffing, phishing) and removes the support burden of staff forgetting passwords. They get a fresh OTP every time.

### Flow 4 — Forgot Password (Customer Only)

```
1. Customer enters email on "Forgot Password" form
2. POST /api/auth/forgot-password { email }
3. Server:
   - If email exists, creates OtpSession with purpose=RESET_PASSWORD
   - Sends "Reset your VolteX password" email with 6-digit OTP
   - Always returns "If account exists, code sent" (prevents email enumeration)
4. Customer enters OTP + new password
5. POST /api/auth/reset-password { email, otp, newPassword }
6. Server:
   - Verifies OTP via bcrypt.compare
   - Updates passwordHash
   - Invalidates all existing refreshTokens (force re-login on all devices)
```

### JWT Architecture Choices

| Decision | Why |
|----------|-----|
| Short access token (15min) | Limits damage if a token leaks. |
| Long refresh token (7d) | User doesn't have to log in every 15 min. |
| Refresh token stored as **SHA256 hash** in DB | If DB leaks, attacker can't use the tokens. |
| Refresh token **rotation** (new pair each refresh) | Detects token theft — if an old token is used, all tokens for that user can be revoked. |
| Tokens in **localStorage** (not cookies) | Simpler for CORS-heavy 3-app architecture. Trade-off: more XSS-vulnerable, mitigated by strict CSP. |

---

## 7. The Customer Shopping Flow (End-to-End)

This is the heart of the application — what happens from "I want a phone" to "order placed":

### Step 1 — Browse
```
Customer opens https://volex.com
  → Next.js renders home page (server-side)
  → Calls GET /api/categories  (fetches real categories from DB)
  → Renders CategorySlider, ProductShowcase, DealsOfDay, etc.
```

### Step 2 — Search / Filter
```
Customer types "iPhone" in navbar search
  → Client navigates to /search?q=iPhone
  → Server-rendered page calls GET /api/products?search=iPhone
  → Backend uses Prisma to query Products with:
       WHERE name ILIKE '%iPhone%' OR description ILIKE '%iPhone%'
       AND isActive = true
       AND (filters from query string)
       ORDER BY price ASC
       LIMIT 20 OFFSET 0
  → Returns paginated results
```

### Step 3 — Product Detail
```
Customer clicks an iPhone
  → Navigates to /product/i-phone-17-pro-max
  → GET /api/products/i-phone-17-pro-max  (lookup by slug)
  → Page shows:
     - Image gallery (multiple images from images[] array)
     - Price, MRP, discount calculation
     - Variants (JSON field on Product)
     - Specs (specGroups JSON field)
     - Bank offers (bankOffers JSON field)
     - Reviews section → calls GET /api/reviews/products/<id>
     - Related products
```

### Step 4 — Add to Cart
```
Customer clicks "Add to Cart"
  → If not logged in: opens login modal (or "Continue as Guest")
  → Once authenticated: POST /api/cart { productId, quantity }
  → Server upserts CartItem (unique on userId+productId, so adding twice increments quantity)
  → Frontend dispatches `voltex:cart-updated` event
  → Navbar's cart badge listens for this event and re-fetches GET /api/cart to update the count
```

### Step 5 — Checkout
```
Customer navigates to /checkout
  → GET /api/cart  → shows items + subtotal
  → GET /api/addresses  → lets customer pick or create address
  → Customer enters coupon code (optional)
       → POST /api/coupons/validate { code, subtotal }
       → Returns discountAmount or "Invalid" error
       → If valid, subtotal updates
  → Customer clicks "Proceed to Payment"
```

### Step 6 — Razorpay Payment
```
1. Frontend: POST /api/payments/razorpay/order
   { addressId, items, couponCode }

2. Server:
   - Validates all items have sufficient stock
   - Calculates final amount (subtotal - couponDiscount) in paise
   - Calls Razorpay API to create a Razorpay order
   - Returns { keyId, razorpayOrderId, amount, currency: "INR" }

3. Frontend dynamically loads Razorpay's checkout JS script
4. Opens Razorpay Checkout modal (test mode in dev)
5. Customer enters card / UPI / netbanking details
6. Razorpay processes payment
7. Razorpay returns: { razorpayPaymentId, razorpaySignature }

8. Frontend: POST /api/payments/razorpay/verify
   { razorpayOrderId, razorpayPaymentId, razorpaySignature,
     addressId, items, couponCode }

9. Server (this is the critical security step):
   - Computes HMAC-SHA256 of (razorpayOrderId + "|" + razorpayPaymentId)
     using RAZORPAY_KEY_SECRET as the key
   - Compares against the signature Razorpay sent
   - If signatures don't match: REJECT — payment is forged
   - If they match: signature is genuinely from Razorpay

10. Server places the order in a Prisma $transaction:
    ┌──────────────────────────────────────────────┐
    │ BEGIN TRANSACTION                            │
    │                                              │
    │ For each item:                               │
    │   UPDATE Product SET stock = stock - quantity│
    │   WHERE id = productId AND stock >= quantity │
    │   (conditional UPDATE prevents overselling)  │
    │                                              │
    │ INSERT INTO Order (...) with paymentStatus=PAID
    │ INSERT INTO OrderItem (each with snapshot price)
    │ DELETE FROM CartItem WHERE userId = ...      │
    │                                              │
    │ COMMIT (or ROLLBACK on any failure)          │
    └──────────────────────────────────────────────┘

11. Fire-and-forget: send order confirmation email via Resend
12. Return order details to client
13. Client redirects to /checkout/success?orderId=...
```

### Why use a transaction?
Without it, you could get this race condition:
1. Last iPhone in stock (1 unit)
2. Two customers click "Buy" simultaneously
3. Both reads see `stock = 1`
4. Both updates succeed → `stock = -1`
5. Both orders created → one customer never gets their phone

With the conditional `WHERE stock >= quantity` inside a transaction, the second customer's UPDATE matches 0 rows, throws an error, and the entire transaction rolls back.

### Step 7 — Order Tracking
```
Customer goes to /account/orders
  → GET /api/orders/my  → list of all their orders
  → Click an order → /account/orders/<orderId>
  → GET /api/orders/<orderId>  → full detail
  → Shows: items with snapshot prices, address, payment info, status

When admin updates the status:
  → PUT /api/orders/<orderId>/status  { status: "SHIPPED" }
  → Server validates the transition is legal (PENDING→CONFIRMED→SHIPPED→DELIVERED)
  → Server fires status update email to customer
```

---

## 8. The Admin Flow

### Logging In
Same JWT flow as customer but the admin role gates everything. The admin dashboard sits behind `<ProtectedRoute>` and most routes additionally check `<RequireRole allowed={["ADMIN"]}>`.

### Managing Products
```
Admin clicks "Add Product"
  1. Fills form: name, description, price, MRP, stock, brand, warranty
  2. Selects category from tree-aware dropdown (loaded from /api/categories/flat)
  3. Uploads images:
     → Browser reads file → base64 string
     → POST /api/uploads/image { file: "data:image/jpeg;base64,...", filename, folder }
     → Server validates MIME type (JPEG/PNG/WebP/GIF) + size (≤5MB)
     → Uploads to Supabase Storage
     → Returns { url, path, bucket }
     → Admin form stores the url in images[] array
  4. Fills JSON editors for: variants, specGroups, bankOffers, overview, highlights
  5. POST /api/products → product created
  6. Slug auto-generated from name ("Apple iPhone 17 Pro" → "apple-iphone-17-pro")
```

### Managing Orders
```
Admin opens /orders
  → GET /api/orders?status=PENDING&page=1
  → Table shows order ID, customer, date, total, status
  → Inline dropdown lets admin change status:
     PENDING → CONFIRMED, CANCELLED
     CONFIRMED → SHIPPED, CANCELLED
     SHIPPED → DELIVERED
     DELIVERED/CANCELLED → terminal (no further changes)
  → Each status change PUT /api/orders/:id/status
  → Server sends a status update email to the customer
```

### Managing Coupons
```
Admin opens /coupons
  → Lists all coupons with code, type, value, used/maxUses, expiry, active
  → Click "Add Coupon":
     - code: "WELCOME10"
     - discountType: PERCENTAGE | FIXED
     - discountValue: 10
     - minOrderAmount: 1000 (don't apply on tiny carts)
     - maxUses: 100 (or null = unlimited)
     - expiresAt: optional date
     - isActive: toggle
  → POST /api/coupons
```

### Moderating Reviews
```
Admin opens /reviews
  → GET /api/reviews?status=PENDING
  → Lists all pending reviews with product, user, rating, comment
  → Approve: PUT /api/reviews/:id/status { status: "APPROVED" }
     - Server also updates Product's aggregate rating + reviewCount
  → Reject: PUT /api/reviews/:id/status { status: "REJECTED" }
  → Delete: DELETE /api/reviews/:id (admin only)
```

### Inviting Staff
```
Admin opens /team
  → Enters new staff email
  → POST /api/invitations { email, name }
  → Server creates Invitation row + sends invite email via Resend
  → Invitations table shows pending/used status
  → Admin can DELETE /api/invitations/:id to revoke
```

---

## 9. Security Architecture

The app uses **defense in depth** — multiple layers of protection:

### Network layer
- **HTTPS everywhere** (Vercel auto-provisions Let's Encrypt certs)
- **CORS** restricted to `CLIENT_URL` and `ADMIN_URL` env vars — no other origin can call the API
- **Helmet** sets security headers (CSP, X-Frame-Options, X-Content-Type-Options, HSTS)

### Rate limiting
- **General:** 100 requests/minute per IP (blocks scrapers)
- **Auth endpoints:** 10 requests / 15 minutes (blocks brute force)
- **OTP endpoints:** 5 requests / 15 minutes (limits OTP enumeration)

### Authentication
- Passwords: **bcrypt 12 rounds** (very expensive to crack)
- OTPs: **bcrypt 10 rounds** + 15-min expiry + single-use
- JWT access tokens: 15-minute expiry, signed with HS256
- JWT refresh tokens: 7-day expiry, **SHA256-hashed in DB**, rotated on each use

### Authorization
- `requireAuth` middleware: verifies JWT, sets `req.user`
- `requireRole("ADMIN", "STAFF")` middleware: checks role
- Customer endpoints check `req.user.id === resource.userId` to prevent users seeing each other's orders/addresses

### Input validation
- **Zod schemas** on every request body — invalid data never reaches business logic
- **Prisma parameterized queries** — SQL injection impossible
- **Base64 image validation** — MIME whitelist + 5MB cap

### Payment security
- **HMAC-SHA256 signature verification** on every Razorpay webhook
- `paymentId` is a unique constraint on Order — replay attacks blocked
- Final amount **always computed server-side**, never trusted from client

### Soft deletes
- Products and categories use `isActive` flag instead of `DELETE` — preserves order history

---

## 10. Email System (Resend)

The server sends 5 types of emails. All use a shared branded HTML template (dark theme, VolteX logo header):

| Email | Triggered By | Contains |
|-------|--------------|----------|
| **Staff invitation** | Admin invites new staff | Welcome message + login URL |
| **Staff OTP login** | Staff requests OTP | Large 6-digit code |
| **Password reset** | Customer requests reset | Large 6-digit code |
| **Order confirmation** | Customer places order | Order ID, items, total, address |
| **Order status update** | Admin changes order status | New status + tracking info |

### How they're sent
- Server has `email.service.ts` with one function per email type
- Each function calls Resend's HTTPS API with the rendered HTML
- Order emails are **fire-and-forget** — they don't block the order placement response
- If Resend fails, the order still gets created; email failure is logged but not surfaced

---

## 11. Deployment (Vercel)

All 3 apps deploy to Vercel:

```
Server deployment:
  - Vercel detects /server has vercel.json
  - Builds with `npm run build` (tsc → dist/)
  - Wraps Express app as serverless functions
  - Each route is a serverless function
  - Cold start ~200ms, warm <50ms
  - URL: https://volex-ecommerce-4xsz.vercel.app

Client deployment:
  - Vercel detects /client is Next.js
  - Native Next.js deployment (SSR + ISR + static)
  - Edge network for static assets
  - URL: https://<client-app>.vercel.app

Admin deployment:
  - Vercel detects /admin is Vite
  - Static SPA deployment (single index.html + JS bundles)
  - URL: https://<admin-app>.vercel.app
```

### Environment variables (set in Vercel dashboard)
Each deployment has its own set:

**Server:** `DATABASE_URL`, `JWT_*_SECRET`, `RESEND_API_KEY`, `SUPABASE_*`, `RAZORPAY_*`, `CLIENT_URL`, `ADMIN_URL`, `NODE_ENV=production`

**Client:** `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`

**Admin:** `VITE_API_URL`, `VITE_SUPABASE_*`

### CI/CD
GitHub Actions runs on every PR:
- `npm run lint` per touched package
- `npm run build` per touched package
- If both pass, PR is mergeable

---

## 12. The Code You Should Read First

If someone asks "show me how this works," point them at these files in order:

| File | What you'll learn |
|------|-------------------|
| `server/prisma/schema.prisma` | The entire data model in one place |
| `server/src/app.ts` | All API routes mounted + middleware chain |
| `server/src/modules/orders/orders.service.ts` | The atomic order placement transaction — the heart of the backend |
| `server/src/modules/payments/payments.service.ts` | Razorpay signature verification — the most security-sensitive code |
| `server/src/middleware/auth.middleware.ts` | JWT verification flow |
| `client/contexts/AuthContext.tsx` | How the client tracks login state + auto-refresh |
| `client/components/checkout/CheckoutClient.tsx` | The full checkout UX flow |
| `admin/src/App.tsx` | All admin routes with role guards |
| `admin/src/pages/Orders.tsx` | Inline status updates pattern |

---

## 13. Project Status (May 2026)

### ✅ Fully built and deployed
- 14 server API modules (auth, products, categories, cart, wishlist, addresses, orders, payments, uploads, users, dashboard, invitations, **coupons**, **reviews**)
- Customer storefront — all flows wired with real APIs
- Admin dashboard — all 11 pages wired
- Email system (5 email types)
- Razorpay integration (test mode)
- Supabase image uploads
- JWT auth with refresh rotation
- Role-based access control
- Vercel deployments for all 3 apps
- CI/CD pipeline

### ⏳ Planned (in priority order)

**🔴 Critical**
- Fix production CORS env vars (`CLIENT_URL`, `ADMIN_URL`, `NODE_ENV=production` on Vercel server project)
- Razorpay webhook handler for async refunds/disputes
- Replace mock notifications with real notifications API
- Wire client Settings save handlers

**🟠 Important**
- Search autocomplete API + UI
- Recently viewed products tracking
- Order tracking timeline UI
- Pincode / delivery availability check
- Dark mode toggle UI (next-themes installed)
- Admin dashboard chart with time-range picker
- Bulk operations (CSV export, bulk status update)
- Staff role editing / deactivation

**🟡 Nice to have**
- Social login (Google OAuth)
- Product comparison
- EMI calculator
- Real-time admin notifications (SSE)
- Audit log
- Share product (Web Share API)
- PWA support
- sitemap.xml / robots.txt

**🔧 Infrastructure**
- Error tracking (Sentry on all 3 packages)
- Automated test suite (Vitest)
- Database backup automation
- Production monitoring & alerts

**📱 Mobile**
- React Native + Expo app (currently only scaffolded)

---

## 14. Common Questions

### "Why not Next.js for the admin too?"
Next.js shines for SEO-heavy customer-facing sites. Admin is an authenticated SPA with no SEO needs — Vite gives faster dev experience and smaller production bundles.

### "Why not a single monolithic Next.js app with `/admin` routes?"
Three reasons:
1. **Bundle size** — customers would download admin code they'll never use.
2. **Deploy independence** — admin updates shouldn't risk breaking the storefront.
3. **Security blast radius** — keeping admin on a separate origin makes it harder to attack via XSS on the storefront.

### "Why not GraphQL?"
REST is simpler. Most queries are simple CRUD that don't benefit from GraphQL's flexibility. The complexity tax wasn't worth it.

### "Why Razorpay instead of Stripe?"
This is an Indian e-commerce site. Razorpay supports UPI (which Stripe doesn't), local netbanking, and Indian regulatory requirements out of the box.

### "Why Supabase Storage instead of S3?"
Supabase's free tier covers the current needs, ships with a CDN, and is simpler to integrate than configuring an S3 bucket + CloudFront. Easy to migrate later if needed.

### "Why JWT instead of session cookies?"
Three-app architecture across three different origins makes cookies awkward (you'd need careful SameSite + cross-origin cookie config). JWT in localStorage is simpler. Trade-off accepted: slightly more XSS-vulnerable, mitigated by strict CSP and short access token lifetimes.

### "Why no tests?"
Honest answer: speed of iteration during early development. Adding Vitest is on the planned list — first targets would be the order placement transaction and the Razorpay signature verification (the two highest-risk code paths).

---

## 15. The 30-Second Elevator Pitch

> "VolteX is a full-stack Indian electronics e-commerce platform I built in TypeScript. It has three apps deployed on Vercel: a Next.js storefront for customers, a Vite + React dashboard for admins, and an Express REST API backed by PostgreSQL. It handles the entire e-commerce flow — browsing, search, cart, checkout, Razorpay payments, order tracking, reviews, and coupons — plus admin tools for managing products, orders, customers, and staff. Authentication uses JWT with refresh token rotation. Staff log in via email OTP instead of passwords. Order placement is wrapped in a Prisma transaction to prevent overselling, and Razorpay payments are verified with HMAC-SHA256 to prevent forgery. The whole thing is deployed on Vercel with email via Resend and image storage via Supabase."

---

*This document is a living overview. When you ship a new feature or change architecture, update the relevant section here so the project stays explainable to anyone.*
