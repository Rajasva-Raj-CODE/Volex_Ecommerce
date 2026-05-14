@../CLAUDE.md

# VolteX E-Commerce — Admin Dashboard

## Overview

Admin panel for managing products, categories, orders, customers, and staff. Built with Vite + React 19. Fully integrated with the server API — all CRUD pages use real data, not mocks.

**Status:** ~90% integrated. Settings page handlers not wired. Dashboard chart needs real time-range data. Notifications are mock.

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
│   ├── pages/
│   │   ├── Login.tsx                   # Admin email/password + Staff OTP login
│   │   ├── Dashboard.tsx               # KPI cards + chart + recent orders
│   │   ├── Products.tsx                # Product table with search/filters/pagination
│   │   ├── AddProduct.tsx              # Product creation form (all fields)
│   │   ├── EditProduct.tsx             # Product edit form (loads existing data)
│   │   ├── Categories.tsx              # Category CRUD with tree structure
│   │   ├── Orders.tsx                  # Order list with inline status updates
│   │   ├── Customers.tsx               # Customer list with search
│   │   ├── Team.tsx                    # Staff invitation management
│   │   └── Settings.tsx                # Store settings (UI only, handlers not wired)
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
│   │   └── ui/                         # 70+ shadcn/ui components (DO NOT EDIT MANUALLY)
│   │
│   ├── lib/
│   │   ├── api.ts                      # Fetch wrapper with Bearer token + auto-refresh
│   │   ├── auth-context.tsx            # React Context — auth state + methods
│   │   ├── auth-api.ts                 # Login, logout, refresh, me
│   │   ├── products-api.ts             # Products CRUD + filters
│   │   ├── categories-api.ts           # Categories CRUD + tree/flat/admin
│   │   ├── orders-api.ts               # Orders list + status update
│   │   ├── users-api.ts                # Customers list
│   │   ├── dashboard-api.ts            # Dashboard summary
│   │   ├── uploads-api.ts              # Image upload to Supabase
│   │   ├── invitations-api.ts          # Staff invitations + OTP auth
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
| auth-api | POST /auth/login, /auth/logout, /auth/refresh, GET /auth/me |
| products-api | GET /products (with filters), GET /products/:id, POST /products, PUT /products/:id, DELETE /products/:id |
| categories-api | GET /categories, /categories/flat, /categories/admin, POST /categories, PUT /categories/:id, DELETE /categories/:id |
| orders-api | GET /orders (with filters), PUT /orders/:id/status |
| users-api | GET /users (with search + pagination) |
| dashboard-api | GET /dashboard/summary |
| uploads-api | POST /uploads/image |
| invitations-api | GET /invitations, POST /invitations, DELETE /invitations/:id, POST /invitations/auth/request-otp, POST /invitations/auth/verify-otp |

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

### Settings
- UI sections: Store Info, Notifications, Security, Appearance, Regional
- **All handlers are stubs** — forms exist but don't save

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

## What's Working

- Admin + Staff login (email/password + OTP)
- Auth with token refresh
- Products full CRUD with image uploads
- Categories full CRUD with tree structure
- Orders list with inline status management
- Customers list with search/filter
- Dashboard KPI cards with real data
- Team invitation management
- Responsive sidebar + header
- Toast notifications (Sonner)
- Role-based navigation and route protection

## What's NOT Working / Incomplete

- Settings page — UI built, save handlers not implemented
- Dashboard chart — component exists, minimal data binding (no time-range picker)
- Notifications — header icon shows, data is hardcoded mock
- Bulk export/CSV download — not implemented
- Order detail modal/page — basic expand exists, no full detail view
- Analytics time-range picker — not implemented
- Staff role editing/deactivation — invite-only, can't change roles after creation
- Audit log — not implemented
- Real-time updates — no WebSocket/SSE, manual refresh only
