@../CLAUDE.md

# VolteX E-Commerce — Admin Dashboard

## Overview

Admin panel for managing products, categories, orders, customers, and staff. Built with Vite + React 19. Fully integrated with the server API — all CRUD pages use real data, not mocks.

**Status (May 2026):** All 11 admin pages wired with real APIs including Coupons and Reviews moderation. Settings password change + theme picker wired (store info handlers partial). Dashboard chart needs real time-range data. Header notifications are still mock. Deployed on Vercel.

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Build Tool | Vite | 8.0.1 |
| Framework | React | 19.2.4 |
| Language | TypeScript | 5.9.3 |
| Routing | React Router DOM | 7.13.2 |
| Styling | Tailwind CSS | 4.2.2 |
| Components | shadcn/ui | 70+ components |
| Data Tables | TanStack React Table | 8.21.3 |
| Charts | Recharts | 3.8.0 |
| Drag & Drop | @dnd-kit | 6.3.1+ |
| Validation | Zod | 4.3.6 |
| Toasts | Sonner | — |
| Icons | HugeIcons + Lucide | — |
| Theming | next-themes | — |

**Dev server port:** 3002

## Commands

```bash
npm run dev     # Vite dev server → :3002
npm run build   # Production build
npm run lint    # ESLint
```

## Project Structure

```
admin/
├── src/
│   ├── main.tsx                        # Entry point — BrowserRouter + ThemeProvider + AuthProvider
│   ├── App.tsx                         # Route definitions with ProtectedRoute/RequireRole wrappers
│   ├── index.css                       # Tailwind imports + CSS variables
│   │
│   ├── pages/                          # 11 pages
│   │   ├── Login.tsx                   # Admin email/password + Staff OTP login
│   │   ├── Dashboard.tsx               # KPI cards + chart + recent orders
│   │   ├── Products.tsx                # Product table with search/filters/pagination
│   │   ├── AddProduct.tsx              # Product creation form (all fields)
│   │   ├── EditProduct.tsx             # Product edit form (loads existing data)
│   │   ├── Categories.tsx              # Category CRUD with tree structure
│   │   ├── Orders.tsx                  # Order list with inline status updates + detail sheet
│   │   ├── Customers.tsx               # Customer list with search
│   │   ├── Team.tsx                    # Staff invitation management
│   │   ├── Coupons.tsx                 # Coupon CRUD (PERCENTAGE/FIXED, expiry, max uses)
│   │   ├── Reviews.tsx                 # Review moderation (approve/reject/delete)
│   │   └── Settings.tsx                # Password change + theme picker wired (store info handlers partial)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx     # Sidebar + header shell
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.tsx      # Auth guard
│   │   │   └── RequireRole.tsx         # Role-based access control
│   │   ├── app-sidebar.tsx             # Left navigation (role-filtered items)
│   │   ├── site-header.tsx             # Top header with search + notifications
│   │   ├── section-cards.tsx           # Dashboard KPI stat cards
│   │   ├── chart-area-interactive.tsx  # Recharts area chart
│   │   ├── data-table.tsx              # TanStack table wrapper
│   │   ├── pagination-controls.tsx     # Pagination UI
│   │   ├── order-detail-sheet.tsx      # Order detail side sheet (items, coupon, address, payment)
│   │   └── ui/                         # 70+ shadcn/ui components (DO NOT EDIT MANUALLY)
│   │
│   ├── lib/
│   │   ├── api.ts                      # Fetch wrapper with Bearer token + auto-refresh
│   │   ├── auth-context.tsx            # React Context — auth state + methods
│   │   ├── auth-api.ts                 # Login, logout, refresh, me, change password
│   │   ├── products-api.ts             # Products CRUD + filters
│   │   ├── categories-api.ts           # Categories CRUD + tree/flat/admin
│   │   ├── orders-api.ts               # Orders list + status update (includes couponCode/discountAmount fields)
│   │   ├── users-api.ts                # Customers list
│   │   ├── dashboard-api.ts            # Dashboard summary
│   │   ├── uploads-api.ts              # Image upload to Supabase
│   │   ├── invitations-api.ts          # Staff invitations + OTP auth
│   │   ├── coupons-api.ts              # Coupon CRUD
│   │   ├── reviews-api.ts              # Review list + moderation
│   │   ├── types.ts                    # TypeScript interfaces
│   │   ├── utils.ts                    # cn() utility
│   │   └── roles.ts                    # Role label helper
│   │
│   └── hooks/
│       └── use-mobile.ts               # useIsMobile() — responsive detection
│
├── .env / .env.example
├── vite.config.ts
├── tsconfig.json
├── components.json                     # shadcn/ui configuration
└── package.json
```

## Routes & Access Control

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login.tsx | Public |
| `/` | Dashboard.tsx | ADMIN, STAFF |
| `/products` | Products.tsx | ADMIN, STAFF |
| `/products/add` | AddProduct.tsx | ADMIN, STAFF |
| `/products/edit/:id` | EditProduct.tsx | ADMIN, STAFF |
| `/categories` | Categories.tsx | ADMIN, STAFF |
| `/orders` | Orders.tsx | ADMIN only |
| `/coupons` | Coupons.tsx | ADMIN only |
| `/reviews` | Reviews.tsx | ADMIN only |
| `/customers` | Customers.tsx | ADMIN only |
| `/team` | Team.tsx | ADMIN only |
| `/settings` | Settings.tsx | ADMIN only |

**Protection layers:**
1. `ProtectedRoute` — requires any authenticated user
2. `RequireRole` — restricts by role (e.g., `["ADMIN"]`)

## Authentication

### Auth Context (`lib/auth-context.tsx`)
- **State:** `user`, `isLoading`, `isAuthenticated`
- **Methods:** `login(email, password)`, `logout()`, `hasRole(roles[])`
- **Token storage:** `voltex_admin_access_token`, `voltex_admin_refresh_token` in localStorage
- **Bootstrap:** On mount, checks tokens → fetches `/auth/me` → sets user
- **Auto-refresh:** On 401, retries with refresh token

### Login Flows
1. **Admin:** Email + password → `POST /auth/login` → JWT tokens
2. **Staff OTP:** Enter email → `POST /invitations/auth/request-otp` → enter OTP → `POST /invitations/auth/verify-otp` → JWT tokens

## API Integration

### Fetch Wrapper (`lib/api.ts`)
- Base URL: `VITE_API_URL` (default: `http://localhost:8000/api`)
- Adds `Authorization: Bearer {token}` to all requests
- Auto-refresh on 401
- Throws `ApiError` on failure

### All API Endpoints Used

| Module | Endpoints |
|--------|-----------|
| auth-api | POST /auth/login, /auth/logout, /auth/refresh, GET /auth/me, PUT /users/change-password |
| products-api | GET /products (with filters), GET /products/:id, POST /products, PUT /products/:id, DELETE /products/:id |
| categories-api | GET /categories, /categories/flat, /categories/admin, POST /categories, PUT /categories/:id, DELETE /categories/:id |
| orders-api | GET /orders (with filters), PUT /orders/:id/status |
| users-api | GET /users (with search + pagination) |
| dashboard-api | GET /dashboard/summary |
| uploads-api | POST /uploads/image |
| invitations-api | GET /invitations, POST /invitations, DELETE /invitations/:id, POST /invitations/auth/request-otp, POST /invitations/auth/verify-otp |
| coupons-api | GET /coupons, POST /coupons, PUT /coupons/:id, DELETE /coupons/:id |
| reviews-api | GET /reviews, PUT /reviews/:id/status, DELETE /reviews/:id |

## Page Details

### Dashboard
- **Admin view:** Total revenue, orders, customers, products (KPI cards) + area chart + recent orders table
- **Staff view:** Total products, low stock items, new this month
- **Data source:** `GET /dashboard/summary`

### Products
- Table: name, category, price, stock, status
- Status derivation: Active (stock ≥ 10), Low Stock (1-9), Out of Stock (0), Inactive (!isActive)
- Filters: All, Active, Low Stock, Out of Stock, Inactive
- Search (debounced 250ms), pagination (20/page)
- Actions: Edit, Copy ID, Delete

### Add/Edit Product
- Full form: name, slug (auto-generated), description, price, MRP, stock, brand, warranty
- Image management: upload multiple images via `/uploads/image`
- JSON editors: specGroups, variants, bankOffers, overview, highlights
- Category selector (tree-aware)
- Related products (ID array)

### Categories
- Tree structure display (parent → children)
- Dialog forms for create/edit/delete
- Image upload per category
- Sort order, active toggle
- Search + pagination

### Orders
- Table: order ID, customer, date, total, status
- Status badges: PENDING (amber), CONFIRMED (blue), SHIPPED (purple), DELIVERED (emerald), CANCELLED (red)
- Inline status dropdown with valid transitions:
  - PENDING → CONFIRMED, CANCELLED
  - CONFIRMED → SHIPPED, CANCELLED
  - SHIPPED → DELIVERED
  - DELIVERED/CANCELLED → terminal (no changes)
- Expandable order details (items, address, payment info)

### Customers
- Table: name, email, orders count, total spend, status, join date
- Search by name/email
- Filters: All, Active, Inactive
- Read-only (no direct edit)

### Team
- Invite staff by email (sends invitation via server → Resend email)
- List all invitations with status (pending/used)
- Revoke invitations

### Coupons
- Table with code, type (PERCENTAGE/FIXED), value, min order, max uses, used count, expiry, active
- Dialog forms for create/edit
- Activation toggle
- Search + pagination

### Reviews
- Table with product, user, rating, comment, status, created date
- Moderation actions: approve/reject (updates status), delete
- Filter by status (pending/approved/rejected)
- Search + pagination

### Settings
- UI sections: Store Info, Notification Preferences, Security, Appearance, Regional
- **Wired:** Password change (calls `PUT /users/change-password`), Theme picker (light/dark/system)
- **Not wired:** Store info, notification preferences, regional settings — UI exists, save handlers are stubs

## Styling

- **Color scheme:** Teal/cyan primary (oklch), dark background
- **CSS variables:** oklch color space, custom `--primary`, `--background`, etc.
- **Responsive:** Mobile-first, sidebar collapses on mobile, grid adapts (1→2→4 cols)
- **Utility:** `cn()` (clsx + tailwind-merge)
- **Container queries:** `@container/main` for component-level responsiveness

## Environment Variables

```env
VITE_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_ANON_KEY=
```

## ✅ What's Built (all 11 pages wired)

- [x] Admin email/password + Staff OTP login
- [x] Auth with JWT refresh rotation
- [x] Products — full CRUD with image uploads, JSON editors for specs/variants/bankOffers
- [x] Categories — full CRUD with tree structure, image uploads per category, sort order, active toggle
- [x] Orders — list with inline status updates, detail side sheet showing items + coupon + address + payment
- [x] Customers — list with search/filter (read-only)
- [x] Dashboard — role-aware KPI cards (admin: revenue/orders/customers/products; staff: products/low-stock/new) + recent orders
- [x] Team — staff invitation management (send via Resend, list, revoke)
- [x] **Coupons — full CRUD (PERCENTAGE/FIXED, min order, max uses, expiry, active toggle)**
- [x] **Reviews — moderation (approve/reject/delete) with status filter**
- [x] Settings — password change + theme picker wired
- [x] Responsive sidebar + header, role-based navigation
- [x] Toast notifications (Sonner)
- [x] Role-based route protection (`ProtectedRoute` + `RequireRole`)

## ⏳ What's Planned

### 🔴 Critical
- [ ] **Fix production deployment** — set `VITE_API_URL` to deployed server URL; needs CORS on server (`ADMIN_URL` env on Vercel server project)
- [ ] **Wire remaining Settings handlers** — store info, notification preferences, regional settings currently don't save

### 🟠 Important
- [ ] **Dashboard chart with time-range picker** — currently minimal data binding (7d/30d/90d/1y selector)
- [ ] **Header notifications** — replace hardcoded mock data with real notifications API
- [ ] **Bulk operations** — CSV export for orders/customers/products; bulk status update for orders
- [ ] **Full order detail page** — currently side sheet only; add a dedicated `/orders/:id` route
- [ ] **Staff role editing / deactivation** — currently invite-only, no way to change roles or deactivate after creation
- [ ] **Real-time updates** — no WebSocket/SSE; new orders require manual refresh

### 🟡 Nice to have
- [ ] Audit log for admin actions (who changed what, when)
- [ ] Stock alert dashboard (low/out-of-stock products by category)
- [ ] Revenue breakdown by category/brand
- [ ] Customer lifetime value calculation
- [ ] Refund/return management UI (depends on Razorpay webhook on server)
- [ ] Email template editor (currently hardcoded in `server/src/services/email.service.ts`)
