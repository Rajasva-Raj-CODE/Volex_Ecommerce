# VolteX — Admin Dashboard

The internal admin panel for VolteX. Built with **Vite + React 19**, React Router DOM 7, and Tailwind CSS 4. Handles product management, orders, customers, categories, and team access.

> **Status:** UI complete — all CRUD pages built with mock data. Backend integration is next.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Vite | 8.0.1 | Build tool (fast HMR) |
| React | 19.2.4 | UI library |
| TypeScript | 5.9.3 | Type safety |
| React Router DOM | 7.13.2 | Client-side routing |
| Tailwind CSS | 4.2.2 | Styling |
| shadcn/ui | latest | Component library |
| TanStack React Table | latest | Data tables |
| Recharts | 3.8.0 | Charts & analytics |
| @dnd-kit | latest | Drag-and-drop |
| Zod | latest | Form validation |
| HugeIcons + Lucide | latest | Icon sets |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## Project Structure

```
admin/
├── index.html                    # Vite HTML entry point
├── src/
│   ├── main.tsx                 # React app bootstrap
│   ├── App.tsx                  # Root component + React Router routes
│   ├── index.css                # Global styles + Tailwind imports
│   │
│   ├── pages/                   # Route-level page components
│   │   ├── Login.tsx            # Admin login
│   │   ├── Dashboard.tsx        # Analytics overview
│   │   ├── Products.tsx         # Product list + data table
│   │   ├── AddProduct.tsx       # New product form
│   │   ├── EditProduct.tsx      # Edit product form
│   │   ├── Orders.tsx           # Orders management
│   │   ├── Customers.tsx        # Customer list
│   │   ├── Categories.tsx       # Category management
│   │   ├── Team.tsx             # Team members
│   │   └── Settings.tsx         # Admin settings
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx   # Shell layout with sidebar + header
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.tsx    # Auth guard HOC
│   │   │   └── RequireRole.tsx       # Role-based access control
│   │   ├── app-sidebar.tsx           # Left navigation sidebar
│   │   ├── site-header.tsx           # Top header bar
│   │   ├── nav-main.tsx              # Primary nav links
│   │   ├── nav-secondary.tsx         # Secondary nav links
│   │   ├── nav-user.tsx              # User account menu
│   │   ├── data-table.tsx            # Reusable TanStack table
│   │   ├── chart-area-interactive.tsx # Recharts area chart
│   │   ├── section-cards.tsx         # Dashboard KPI stat cards
│   │   ├── team-switcher.tsx         # Workspace/team switcher
│   │   └── ui/                       # shadcn/ui primitives (DO NOT edit manually)
│   │
│   ├── hooks/
│   │   └── use-mobile.ts            # useIsMobile() — responsive detection
│   │
│   └── lib/
│       ├── utils.ts                 # cn() — clsx + tailwind-merge
│       ├── types.ts                 # Shared TypeScript types
│       └── auth-context.tsx         # Auth context with role management
│
└── public/
    ├── favicon.svg
    └── icons.svg
```

---

## Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/login` | Admin login | Public |
| `/` | Dashboard — KPIs + charts | Admin+ |
| `/products` | Product list with search/filter | Admin+ |
| `/products/add` | Add new product | Admin+ |
| `/products/edit/:id` | Edit product | Admin+ |
| `/orders` | Order list + status management | Admin+ |
| `/customers` | Customer list | Admin+ |
| `/categories` | Category tree management | Admin+ |
| `/team` | Team members + roles | Super Admin |
| `/settings` | Admin settings | Admin+ |

---

## Key Features

- **Data Tables** — TanStack React Table with sorting, filtering, pagination
- **Charts** — Recharts area/bar charts on dashboard
- **Drag & Drop** — @dnd-kit for reordering (categories, products)
- **Role-Based Access** — `ProtectedRoute` + `RequireRole` components
- **Responsive Sidebar** — Collapsible on mobile (`useIsMobile()`)
- **Form Validation** — Zod schemas for product/category forms

---

## Roles

| Role | Access |
|------|--------|
| `viewer` | Read-only dashboard |
| `admin` | Full product/order/customer management |
| `super_admin` | Everything + team management + settings |

---

## Environment Variables

Create `.env.local` at the root of `/admin`:

```env
# When backend is ready:
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=VolteX Admin
```

---

## What's Built vs What's Next

### Built (UI)
- [x] Login page with form validation
- [x] Dashboard with KPI cards and interactive charts
- [x] Products table with search, filter, sort, pagination
- [x] Add / Edit product forms
- [x] Orders management page
- [x] Customers list
- [x] Categories management
- [x] Team management
- [x] Settings page
- [x] Role-based route protection (UI only)

### TODO (Backend Integration)
- [ ] Connect login form to `POST /api/auth/admin/login`
- [ ] Store JWT + role in auth context
- [ ] Replace mock products with `GET /api/products`
- [ ] Wire add/edit product forms to `POST/PUT /api/products`
- [ ] Replace mock orders with `GET /api/orders`
- [ ] Real customer data from `GET /api/users`
- [ ] Category CRUD APIs
- [ ] Image upload for products (multipart/form-data)
- [ ] Role management via API
