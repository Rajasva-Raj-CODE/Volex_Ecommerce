# VolteX E-Commerce Platform Documentation

## Project Overview

### Project Name
**VolteX** — Electronics & Appliances E-Commerce Platform

### Purpose
VolteX is a full-featured e-commerce platform for selling electronics and home appliances. The platform consists of two interconnected applications:
1. **Client Application** — Public-facing storefront for customers
2. **Admin Dashboard** — Internal management system for store operations

### Key Features

#### Client Application
- Product browsing with category and subcategory navigation
- Product detail pages with image galleries, specifications, and reviews
- Shopping cart functionality with price calculations
- User account management (profile, addresses, orders, wishlist)
- OTP-based login authentication
- Image extraction tool for product data gathering
- Bank offers and EMI options display
- Responsive dark-themed UI design

#### Admin Dashboard
- Dashboard with analytics and key metrics
- Product management (CRUD operations)
- Category and subcategory management
- Order management (super_admin only)
- Customer management (super_admin only)
- Team/user management (super_admin only)
- Role-based access control (RBAC)
- Interactive charts for revenue visualization

### Target Users
- **Customers** — End users shopping for electronics and appliances
- **Administrators** — Store managers handling products, orders, and customers
- **Product Managers** — Staff managing product catalog (limited access)

---

## Tech Stack

### Client Application

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 16.2.1 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Component Library | shadcn/ui + Radix UI | Latest |
| Icons | Hugeicons | 4.0.0 / 1.1.6 |
| State Management | React Context API | Built-in |
| Carousel | Embla Carousel | 8.6.0 |
| Charts | Recharts | 2.15.4 |
| Form Components | React Hook Form + Zod | Latest |
| Theme | next-themes | 0.4.6 |
| Notifications | Sonner | 2.0.7 |

### Admin Dashboard

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | React + Vite | Latest |
| UI Library | React | 19.2.4 |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS | 4.2.2 |
| Component Library | shadcn/ui + Radix UI | Latest |
| Icons | Hugeicons | 4.0.0 / 1.1.6 |
| State Management | React Context API + localStorage | Built-in |
| Routing | React Router DOM | 7.13.2 |
| Tables | TanStack Table | 8.21.3 |
| Charts | Recharts | 3.8.0 |
| Drag & Drop | @dnd-kit | 10.0.0 |
| Form Validation | Zod | 4.3.6 |

### External Services
- **Image Extraction API** — Extract.pics API for scraping product images

---

## Folder Structure

```
Volex_Ecommerce/
├── admin/                          # Admin Dashboard Application
│   ├── public/                     # Static assets
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/              # Authentication components
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   └── RequireRole.tsx
│   │   │   ├── layout/            # Layout components
│   │   │   │   └── DashboardLayout.tsx
│   │   │   └── ui/                # shadcn/ui components
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── input.tsx
│   │   │       ├── select.tsx
│   │   │       ├── sidebar.tsx
│   │   │       ├── table.tsx
│   │   │       └── ... (60+ components)
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── chart-area-interactive.tsx
│   │   │   ├── data-table.tsx
│   │   │   ├── login-form.tsx
│   │   │   ├── nav-*.tsx
│   │   │   ├── section-cards.tsx
│   │   │   ├── site-header.tsx
│   │   │   └── team-switcher.tsx
│   │   ├── hooks/
│   │   │   └── use-mobile.ts
│   │   ├── lib/
│   │   │   ├── auth-context.tsx   # Authentication context
│   │   │   ├── types.ts           # TypeScript types
│   │   │   └── utils.ts           # Utility functions
│   │   ├── pages/
│   │   │   ├── AddProduct.tsx
│   │   │   ├── Categories.tsx
│   │   │   ├── Customers.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── EditProduct.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Orders.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Team.tsx
│   │   ├── App.tsx                # Main app with routing
│   │   ├── index.css              # Global styles
│   │   └── main.tsx               # Entry point
│   ├── components.json
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── eslint.config.js
│
├── client/                         # Customer-Facing Application
│   ├── app/
│   │   ├── (account)/             # Protected account routes
│   │   │   ├── layout.tsx         # Account layout wrapper
│   │   │   ├── address/
│   │   │   ├── notifications/
│   │   │   ├── orders/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   └── wishlist/
│   │   ├── api/                   # API routes
│   │   │   ├── download-image/
│   │   │   │   └── route.ts
│   │   │   └── extract-images/
│   │   │       └── route.ts
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── category/
│   │   │   └── [categorySlug]/
│   │   │       ├── page.tsx
│   │   │       └── [subcategorySlug]/
│   │   │           └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── my-account/
│   │   │   └── page.tsx
│   │   ├── product/
│   │   │   └── [productSlug]/
│   │   │       └── page.tsx
│   │   ├── tools/
│   │   │   └── image-extractor/
│   │   │       └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── account/               # Account-related components
│   │   │   ├── AccountSidebar.tsx
│   │   │   ├── MyAccountClient.tsx
│   │   │   ├── address/
│   │   │   ├── notifications/
│   │   │   ├── orders/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   └── wishlist/
│   │   ├── auth/                 # Authentication components
│   │   │   ├── GlobalLoginModal.tsx
│   │   │   ├── LoginClient.tsx
│   │   │   ├── LoginModal.tsx
│   │   │   └── ProtectedPage.tsx
│   │   ├── cart/
│   │   │   └── CartClient.tsx
│   │   ├── home/                 # Homepage components
│   │   │   ├── BankOffers.tsx
│   │   │   ├── BrandsCarousel.tsx
│   │   │   ├── CategoryItem.tsx
│   │   │   ├── CategorySlider.tsx
│   │   │   ├── CuratedSection.tsx
│   │   │   ├── DealsOfDay.tsx
│   │   │   ├── FromVolteX.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProductShowcase.tsx
│   │   │   ├── WhatsHot.tsx
│   │   │   ├── WarrantyBanner.tsx
│   │   │   ├── UnboxedBlog.tsx
│   │   │   ├── TataNeu.tsx
│   │   │   └── WhyVolteX.tsx
│   │   ├── layout/               # Layout components
│   │   │   ├── navbar/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── MegaMenu.tsx
│   │   │   │   ├── MobileMenu.tsx
│   │   │   │   ├── UserDropdown.tsx
│   │   │   │   └── nav-data.ts
│   │   │   └── Footer.tsx
│   │   └── product/              # Product detail components
│   │       ├── ProductImageGallery.tsx
│   │       ├── ProductInfo.tsx
│   │       ├── ProductSpecifications.tsx
│   │       ├── RelatedProducts.tsx
│   │       └── StickyBottomBar.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx        # Authentication context
│   ├── lib/
│   │   ├── product-data.ts        # Mock product data
│   │   ├── types.ts              # TypeScript types
│   │   └── utils.ts              # Utility functions
│   ├── components.json
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── PROJECT_DOCUMENTATION.md
```

---

## Architecture & Design

### High-Level Architecture

The VolteX platform follows a **multi-application architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    VolteX E-Commerce                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐     ┌─────────────────────────┐   │
│  │   Client App        │     │   Admin Dashboard        │   │
│  │   (Next.js)         │     │   (React + Vite)         │   │
│  │                     │     │                         │   │
│  │  - Public Store     │     │  - Dashboard            │   │
│  │  - Product Pages    │     │  - Product Management   │   │
│  │  - Cart & Checkout  │     │  - Order Management     │   │
│  │  - User Account     │     │  - Customer Management  │   │
│  │  - Auth (OTP)       │     │  - Auth (Credentials)   │   │
│  └─────────────────────┘     └─────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Shared Resources                         │   │
│  │  - TypeScript Types (lib/types.ts)                   │   │
│  │  - UI Component Patterns (shadcn/ui)                │   │
│  │  - Icon Library (Hugeicons)                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Client Architecture (Next.js)

```
Client Application
├── App Router (Next.js 16)
│   ├── Route Groups
│   │   └── (account)/        # Protected account routes
│   ├── Dynamic Routes
│   │   ├── category/[categorySlug]/[subcategorySlug]/
│   │   └── product/[productSlug]/
│   └── API Routes
│       ├── /api/extract-images/
│       └── /api/download-image/
├── Component Structure
│   ├── Server Components (page.tsx files)
│   └── Client Components (*.tsx with 'use client')
└── State Management
    └── React Context API
        └── AuthContext (global auth state)
```

### Admin Architecture (React + Vite)

```
Admin Dashboard
├── React Router v7
│   ├── /login
│   └── Protected Routes (grouped under DashboardLayout)
│       ├── /
│       ├── /products
│       ├── /products/add
│       ├── /products/edit/:id
│       ├── /categories
│       ├── /orders (super_admin)
│       ├── /customers (super_admin)
│       ├── /team (super_admin)
│       └── /settings (super_admin)
├── Component Structure
│   ├── Layout Components
│   │   └── DashboardLayout
│   ├── UI Components (shadcn/ui)
│   └── Feature Components (pages/)
└── State Management
    └── React Context API + localStorage
        └── AuthContext (admin auth)
```

### State Management Approach

#### Client Application
- **AuthContext** — Manages user authentication state globally
- **Component-level state** — Using `useState` for local UI state
- **Mock data** — Static product data in `lib/product-data.ts`

#### Admin Dashboard
- **AuthContext** — Manages admin user session with localStorage persistence
- **Component-level state** — Using `useState` for form inputs and UI state
- **Mock data** — Static data arrays in page components

### Data Flow

#### Client Application Flow
```
User Action
    │
    ▼
Component (useState / useAuth)
    │
    ├──► State Update → UI Re-render
    │
    └──► API Call (if needed)
            │
            ▼
        API Route Handler
            │
            ▼
        External Service (Extract.pics)
```

#### Admin Application Flow
```
User Action (Form Submit)
    │
    ▼
Component State Update
    │
    ▼
AuthContext Validation
    │
    ├──► localStorage Update (persist auth)
    │
    └──► ProtectedRoute Check
            │
            ▼
        Route Access / Redirect
```

---

## Features Breakdown

### 1. Product Browsing (Client)

**Description:** Allow customers to browse products by category and subcategory.

**Related Files:**
- [`client/app/page.tsx`](client/app/page.tsx) — Homepage with category navigation
- [`client/app/category/[categorySlug]/page.tsx`](client/app/category/[categorySlug]/page.tsx) — Category listing
- [`client/app/category/[categorySlug]/[subcategorySlug]/page.tsx`](client/app/category/[categorySlug]/[subcategorySlug]/page.tsx) — Subcategory listing
- [`client/components/home/CategorySlider.tsx`](client/components/home/CategorySlider.tsx) — Category carousel
- [`client/components/layout/navbar/Navbar.tsx`](client/components/layout/navbar/Navbar.tsx) — Navigation with mega menu

**How It Works:**
1. Categories are defined in `nav-data.ts` with subcategories
2. User clicks category in navigation bar
3. Mega menu displays subcategories on hover
4. Clicking navigates to category/subcategory pages
5. Products are filtered and displayed based on URL parameters

---

### 2. Product Details (Client)

**Description:** Display detailed product information with images, specifications, and purchase options.

**Related Files:**
- [`client/app/product/[productSlug]/page.tsx`](client/app/product/[productSlug]/page.tsx) — Product page (Server Component)
- [`client/components/product/ProductImageGallery.tsx`](client/components/product/ProductImageGallery.tsx) — Image carousel
- [`client/components/product/ProductInfo.tsx`](client/components/product/ProductInfo.tsx) — Product details, price, offers
- [`client/components/product/ProductSpecifications.tsx`](client/components/product/ProductSpecifications.tsx) — Technical specs
- [`client/components/product/StickyBottomBar.tsx`](client/components/product/StickyBottomBar.tsx) — Fixed purchase bar
- [`client/lib/product-data.ts`](client/lib/product-data.ts) — Product data with all details

**How It Works:**
1. Page receives `productSlug` from URL
2. `getProductBySlug()` searches mock data
3. If not found, shows 404 page
4. Components render product details from mock data
5. User can select variants, view bank offers, check delivery

---

### 3. Shopping Cart (Client)

**Description:** Shopping cart functionality with quantity management and order summary.

**Related Files:**
- [`client/app/cart/page.tsx`](client/app/cart/page.tsx) — Cart page
- [`client/components/cart/CartClient.tsx`](client/components/cart/CartClient.tsx) — Cart UI and logic

**Features:**
- Add/remove items
- Quantity adjustment (+/-)
- Price calculations with discount display
- Order summary with totals
- Apply coupon UI (non-functional placeholder)
- Move to wishlist option

**How It Works:**
1. Cart items stored in local React state
2. Pre-populated with mock products (Sony WH-1000XM5, JBL Flip 6)
3. Price calculations: original price, discounted price, savings
4. Empty cart state shows "Continue Shopping" button

---

### 4. User Authentication (Client)

**Description:** OTP-based login system for customers with global modal.

**Related Files:**
- [`client/contexts/AuthContext.tsx`](client/contexts/AuthContext.tsx) — Auth state management
- [`client/components/auth/LoginModal.tsx`](client/components/auth/LoginModal.tsx) — Login form modal
- [`client/components/auth/GlobalLoginModal.tsx`](client/components/auth/GlobalLoginModal.tsx) — Global modal wrapper
- [`client/components/auth/ProtectedPage.tsx`](client/components/auth/ProtectedPage.tsx) — Route protection

**Login Flow:**
1. User clicks login button in navbar
2. `openLoginModal()` sets `loginModalOpen: true`
3. GlobalLoginModal renders LoginModal
4. User enters phone number → receives OTP
5. User enters 6-digit OTP → `login()` called
6. `isLoggedIn: true`, modal closes, UI updates

**Demo Credentials:**
- Any phone number with 6-digit OTP simulation

---

### 5. Account Management (Client)

**Description:** Protected account pages for managing user profile and orders.

**Related Files:**
- [`client/app/(account)/layout.tsx`](client/app/(account)/layout.tsx) — Account layout with protection
- [`client/app/(account)/profile/page.tsx`](client/app/(account)/profile/page.tsx)
- [`client/app/(account)/address/page.tsx`](client/app/(account)/address/page.tsx)
- [`client/app/(account)/orders/page.tsx`](client/app/(account)/orders/page.tsx)
- [`client/app/(account)/wishlist/page.tsx`](client/app/(account)/wishlist/page.tsx)
- [`client/app/(account)/notifications/page.tsx`](client/app/(account)/notifications/page.tsx)
- [`client/app/(account)/settings/page.tsx`](client/app/(account)/settings/page.tsx)
- [`client/components/account/MyAccountClient.tsx`](client/components/account/MyAccountClient.tsx) — Account dashboard
- [`client/components/account/AccountSidebar.tsx`](client/components/account/AccountSidebar.tsx) — Navigation sidebar

**How It Works:**
1. Account routes wrapped in `ProtectedPage`
2. If not logged in → shows blurred content + login prompt
3. If logged in → shows full account content
4. Each sub-page has its own client component for data display

---

### 6. Product Management (Admin)

**Description:** Full CRUD operations for products in admin dashboard.

**Related Files:**
- [`admin/src/pages/Products.tsx`](admin/src/pages/Products.tsx) — Product listing table
- [`admin/src/pages/AddProduct.tsx`](admin/src/pages/AddProduct.tsx) — Add new product form
- [`admin/src/pages/EditProduct.tsx`](admin/src/pages/EditProduct.tsx) — Edit existing product
- [`admin/src/components/data-table.tsx`](admin/src/components/data-table.tsx) — Reusable table component

**AddProduct Features:**
- General info (name, slug, description)
- Category/subcategory hierarchy selection
- Brand and SKU input
- Pricing (selling, MRP, cost)
- Variant management (color, storage, etc.)
- Image upload UI
- Tag management
- SEO fields (title, description)
- Product status toggles (active, featured, draft)

**How It Works:**
1. Product name auto-generates URL slug
2. Category selection shows subcategories dynamically
3. Price comparison shows discount percentage
4. Form state managed with useState hooks
5. Save draft or publish options available

---

### 7. Dashboard & Analytics (Admin)

**Description:** Overview dashboard with metrics, charts, and recent activity.

**Related Files:**
- [`admin/src/pages/Dashboard.tsx`](admin/src/pages/Dashboard.tsx) — Main dashboard
- [`admin/src/components/chart-area-interactive.tsx`](admin/src/components/chart-area-interactive.tsx) — Revenue chart

**Metrics Displayed:**
- **Super Admin View:**
  - Total Revenue (₹12,45,890)
  - Total Orders (1,284)
  - Total Customers (3,421)
  - Total Products (486)
  - Interactive revenue chart
  - Recent orders table

- **Product Manager View:**
  - Total Products (486)
  - Low Stock Items (23)
  - New This Month (18)

**How It Works:**
1. User role detected from AuthContext
2. Role-appropriate stats displayed
3. Chart uses Recharts library
4. Recent orders shown in table format

---

### 8. Role-Based Access Control (Admin)

**Description:** Two roles with different permissions for admin access.

**Related Files:**
- [`admin/src/lib/auth-context.tsx`](admin/src/lib/auth-context.tsx) — Auth with role checking
- [`admin/src/components/auth/ProtectedRoute.tsx`](admin/src/components/auth/ProtectedRoute.tsx) — Auth guard
- [`admin/src/components/auth/RequireRole.tsx`](admin/src/components/auth/RequireRole.tsx) — Role guard
- [`admin/src/components/app-sidebar.tsx`](admin/src/components/app-sidebar.tsx) — Navigation filtering

**Roles:**

| Role | Access |
|------|--------|
| `super_admin` | Full access to all pages including Orders, Customers, Team, Settings |
| `product_manager` | Limited to Dashboard, Products, Categories only |

**Mock Users:**
```javascript
// Super Admin
email: admin@voltex.com
password: admin123

// Product Manager
email: pm@voltex.com
password: pm123
```

**How It Works:**
1. Login validates against mock user array
2. User object stored in context and localStorage
3. `hasRole()` checks user's role against allowed roles
4. Navigation items filtered by role in sidebar
5. Protected routes redirect to login if not authenticated
6. RequireRole redirects if user lacks required role

---

### 9. Image Extraction Tool (Client)

**Description:** Utility tool for extracting images from external websites.

**Related Files:**
- [`client/app/tools/image-extractor/page.tsx`](client/app/tools/image-extractor/page.tsx) — Tool UI
- [`client/app/api/extract-images/route.ts`](client/app/api/extract-images/route.ts) — Extraction API
- [`client/app/api/download-image/route.ts`](client/app/api/download-image/route.ts) — Download API

**Features:**
- Enter URL to extract images
- Display extracted images in grid
- Select/deselect images
- Bulk download selected images
- Progress status updates

**How It Works:**
1. User enters website URL
2. POST to `/api/extract-images` with URL
3. API calls Extract.pics service (requires API key)
4. Polls for extraction completion (max 60s)
5. Returns image URLs
6. User selects images to download
7. POST to `/api/download-image` with image list
8. Images saved to `/public/assets/extracted/`

**API Key Required:**
```
EXTRACT_PICS_API_KEY=your_api_key_here
```

---

## Routing & Navigation

### Client Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Main storefront with hero, categories, products |
| `/login` | Login | Login page |
| `/cart` | Cart | Shopping cart |
| `/my-account` | My Account | Account dashboard |
| `/my-account/profile` | Profile | Edit user profile |
| `/my-account/address` | Addresses | Manage saved addresses |
| `/my-account/orders` | Orders | View order history |
| `/my-account/wishlist` | Wishlist | Saved products |
| `/my-account/notifications` | Notifications | Alert preferences |
| `/my-account/settings` | Settings | Account settings |
| `/product/[slug]` | Product Detail | Individual product page |
| `/category/[category]` | Category | Category product listing |
| `/category/[category]/[subcategory]` | Subcategory | Subcategory listing |
| `/tools/image-extractor` | Image Extractor | Image scraping utility |

### Admin Routes

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/` | Dashboard | All authenticated |
| `/products` | Products | All authenticated |
| `/products/add` | Add Product | All authenticated |
| `/products/edit/:id` | Edit Product | All authenticated |
| `/categories` | Categories | All authenticated |
| `/orders` | Orders | super_admin only |
| `/customers` | Customers | super_admin only |
| `/team` | Team | super_admin only |
| `/settings` | Settings | super_admin only |

### Navigation Structure

#### Client Navigation
```
┌─────────────────────────────────────────────────────────────┐
│  Navbar                                                      │
│  ┌──────┬─────────────────────────────────┬────────────────┐│
│  │Logo  │ Search (click to expand)       │Wish│User│Cart ││
│  └──────┴─────────────────────────────────┴────────────────┘│
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Categories: TVs | Audio | Phones | Laptops | Cameras... ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─ Mega Menu (on hover) ────────────────────────────────┐  │
│  │  Subcategory 1  │  Subcategory 2  │  Subcategory 3   │  │
│  │  • Item A       │  • Item D       │  • Item G        │  │
│  │  • Item B       │  • Item E       │  • Item H        │  │
│  │  • Item C       │  • Item F       │  • Item I        │  │
│  │                 │                 │                  │  │
│  │  [Banner Image] │  [Banner Image] │  [Banner Image] │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

#### Admin Navigation
```
┌─────────────────────────────────────────────────────────────┐
│  App Sidebar (collapsible)                                  │
│  ┌─────────┬─────────────────────────────────────────────┐ │
│  │ VolteX  │  Dashboard                                   │ │
│  │ Admin   │  Products (Add, Edit)                       │ │
│  │ Panel   │  Categories                                 │ │
│  │         │  Orders ──────────────────────────────────  │ │
│  │ ─────── │  Customers ─────────────────────────────    │ │
│  │         │  Team ───────────────────────────────────    │ │
│  │ User    │  Settings ─────────────────────────────     │ │
│  │ Avatar  │                                             │ │
│  │ Name    │                                             │ │
│  │ Role    │                                             │ │
│  │         │                                             │ │
│  │ [Logout]│                                             │ │
│  └─────────┴─────────────────────────────────────────────┘ │
│                                                              │
│  ┌─ Site Header ─────────────────────────────────────────┐ │
│  │ Search │ Notifications │ Theme Toggle                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## API & Backend Integration

### Client API Routes

#### 1. Image Extraction API

**Endpoint:** `POST /api/extract-images`

**Purpose:** Extract images from external websites using Extract.pics service.

**Request:**
```json
{
  "url": "https://www.croma.com/..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "extractionId": "ext_abc123",
  "url": "https://www.croma.com/...",
  "imageCount": 15,
  "images": [
    { "id": "1", "url": "https://..." },
    { "id": "2", "url": "https://..." }
  ]
}
```

**Response (Error):**
```json
{
  "error": "Error message here"
}
```

**Related Files:**
- [`client/app/api/extract-images/route.ts`](client/app/api/extract-images/route.ts)

---

#### 2. Image Download API

**Endpoint:** `POST /api/download-image`

**Purpose:** Download selected images to local storage.

**Request:**
```json
{
  "images": [
    { "url": "https://...", "filename": "image1.jpg" },
    { "url": "https://...", "filename": "image2.jpg" }
  ]
}
```

**Response (Success):**
```json
{
  "downloaded": 2,
  "total": 2,
  "directory": "/public/assets/extracted/",
  "results": [
    { "filename": "image1.jpg", "success": true },
    { "filename": "image2.jpg", "success": true }
  ]
}
```

**Related Files:**
- [`client/app/api/download-image/route.ts`](client/app/api/download-image/route.ts)

---

### Mock Data Sources

The applications use mock data instead of real backend APIs:

#### Client Products
- **Source:** [`client/lib/product-data.ts`](client/lib/product-data.ts)
- **Format:** Array of `ProductDetail` objects
- **Products included:** 10 mock products (TVs, phones, laptops, headphones, cameras)

#### Admin Data
- **Products:** Defined in [`admin/src/pages/Products.tsx`](admin/src/pages/Products.tsx)
- **Orders:** Defined in [`admin/src/pages/Dashboard.tsx`](admin/src/pages/Dashboard.tsx)
- **Customers:** Defined in [`admin/src/pages/Customers.tsx`](admin/src/pages/Customers.tsx)
- **Team Members:** Defined in [`admin/src/pages/Team.tsx`](admin/src/pages/Team.tsx)

---

## Authentication & Authorization

### Client Authentication

**Type:** OTP-based login simulation

**Implementation:**
- Context-based state in [`client/contexts/AuthContext.tsx`](client/contexts/AuthContext.tsx)
- Global modal accessible from any page
- Session stored in React state (not persistent)

**Flow:**
```
1. User clicks login button
2. LoginModal opens (phone number entry)
3. User enters phone, clicks "Send OTP"
4. 6-digit OTP input appears
5. Any 6 digits accepted (demo mode)
6. login() called → isLoggedIn: true
7. Modal closes, UI updates with user info
```

**Logout:** Clears user state, returns to guest view

---

### Admin Authentication

**Type:** Email/password credentials

**Implementation:**
- Context-based state in [`admin/src/lib/auth-context.tsx`](admin/src/lib/auth-context.tsx)
- Persistent session in localStorage
- Role-based navigation and route protection

**Flow:**
```
1. User navigates to /login
2. Enters email and password
3. Form submits → login(email, password)
4. Validates against MOCK_USERS array
5. If match → store user in state + localStorage
6. Redirect to / (dashboard)
7. If no match → show error
```

**Role Protection:**
- `ProtectedRoute` — Ensures user is logged in
- `RequireRole` — Ensures user has specific role
- Navigation items filtered by user role

**Demo Credentials:**
```
Super Admin:    admin@voltex.com / admin123
Product Manager: pm@voltex.com / pm123
```

---

## Components & Reusability

### Shared Component Patterns

Both applications use **shadcn/ui** component library with Radix UI primitives.

#### Button Component
**Location:** `admin/src/components/ui/button.tsx`, `client/components/ui/button.tsx`

**Variants:**
- `default` — Primary action
- `destructive` — Danger/delete actions
- `outline` — Secondary actions
- `secondary` — Tertiary actions
- `ghost` — Subtle/hover actions
- `link` — Text links

**Sizes:** `default`, `sm`, `lg`, `icon`

**Usage:**
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="lg">
  Click Me
</Button>
```

---

### Client-Specific Components

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `Navbar` | Top navigation | Mega menu, search modal, user dropdown |
| `Footer` | Page footer | Links, social, copyright |
| `ProductImageGallery` | Product images | Thumbnail grid, zoom, main image |
| `ProductInfo` | Product details | Price, offers, variants, delivery |
| `CartClient` | Cart management | Add/remove, quantity, summary |
| `LoginModal` | Authentication | Phone + OTP flow |
| `HeroSection` | Homepage hero | Banner carousel |
| `CategorySlider` | Category navigation | Horizontal scroll carousel |

---

### Admin-Specific Components

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `DashboardLayout` | Admin layout wrapper | Sidebar, header, content area |
| `AppSidebar` | Navigation sidebar | Collapsible, role-filtered |
| `SiteHeader` | Top header bar | Search, notifications, user |
| `DataTable` | Generic table | Sorting, pagination, row actions |
| `ChartAreaInteractive` | Revenue chart | Recharts-based area chart |
| `SectionCards` | Dashboard stat cards | Trend indicators |

---

## State Management

### Client State Management

#### AuthContext
```typescript
interface AuthContextValue {
    isLoggedIn: boolean;
    user: AuthUser | null;
    loginModalOpen: boolean;
    login: (user?: Partial<AuthUser>) => void;
    logout: () => void;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}
```

**Usage:**
```tsx
const { isLoggedIn, user, login, logout, openLoginModal } = useAuth();
```

#### Component-Level State
- **Cart:** `useState<CartItem[]>`
- **Forms:** `useState` for each field
- **UI:** `useState` for toggles, modals, selections

---

### Admin State Management

#### AuthContext
```typescript
interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    hasRole: (allowed: Role[]) => boolean;
}

type Role = "super_admin" | "product_manager";
```

**Usage:**
```tsx
const { user, login, logout, hasRole } = useAuth();

// Check role
if (hasRole(["super_admin"])) {
    // Show super admin content
}
```

#### Component-Level State
- **Forms:** `useState` for each field
- **Tables:** Local state for filtering, sorting
- **UI:** Toggle states, selected items

---

## Environment & Configuration

### Client Environment Variables

**File:** `client/.env.local` (create if not exists)

```env
# Extract.pics API Key (required for image extractor)
EXTRACT_PICS_API_KEY=your_api_key_here
```

**Note:** The `.env.local` file is gitignored and should never be committed.

### Admin Configuration

**File:** `admin/src/lib/auth-context.tsx`

Mock users are hardcoded for demo purposes. In production, replace with API calls:
```typescript
const MOCK_USERS = [
    { email: "admin@voltex.com", password: "admin123", user: {...} },
    { email: "pm@voltex.com", password: "pm123", user: {...} },
];
```

---

### Configuration Files

| File | Purpose |
|------|---------|
| `client/next.config.ts` | Next.js configuration |
| `client/tsconfig.json` | TypeScript configuration |
| `client/postcss.config.mjs` | PostCSS/Tailwind configuration |
| `client/components.json` | shadcn/ui components config |
| `admin/vite.config.ts` | Vite configuration |
| `admin/tsconfig.json` | TypeScript configuration |
| `admin/components.json` | shadcn/ui components config |

---

## Setup & Installation Guide

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager

### Client Application Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file
echo "EXTRACT_PICS_API_KEY=your_key_here" > .env.local

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

**Client runs on:** `http://localhost:3000`

---

### Admin Dashboard Setup

```bash
# Navigate to admin directory
cd admin

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Admin runs on:** `http://localhost:5173` (Vite default)

---

### Development Workflow

1. **Start Client:**
   ```bash
   cd client && npm run dev
   ```

2. **Start Admin (separate terminal):**
   ```bash
   cd admin && npm run dev
   ```

3. **Test Admin Login:**
   - Email: `admin@voltex.com`
   - Password: `admin123`

4. **Test Client:**
   - Browse to `http://localhost:3000`
   - Click any product or use the cart
   - Test login modal with any phone + 6-digit OTP

---

## Known Issues & Improvements

### Current Limitations

1. **No Real Backend**
   - All data is mock/static
   - Forms don't persist to database
   - No real payment processing

2. **Image Extractor Requires API Key**
   - Extract.pics service requires registration
   - Rate limits may apply

3. **No Persistent Cart**
   - Cart state resets on page reload
   - Should use localStorage or backend

4. **Admin Auth is Demo-Only**
   - Credentials hardcoded in source
   - No password hashing
   - Should integrate with real auth service

### Suggested Improvements

| Area | Improvement | Priority |
|------|-------------|----------|
| Backend | Add Express/NestJS backend with database | High |
| Auth | Implement JWT tokens, OAuth providers | High |
| Cart | Persist to localStorage or backend | Medium |
| Products | Connect to real product database | Medium |
| Orders | Build order management system | Medium |
| Images | Add image upload with cloud storage | Medium |
| Search | Implement full-text search | Low |
| PWA | Add Progressive Web App support | Low |
| i18n | Add multi-language support | Low |

---

## Future Enhancements

### Short Term
- [ ] Connect to real backend API
- [ ] Add user registration flow
- [ ] Implement checkout process
- [ ] Add order tracking
- [ ] Product review system

### Medium Term
- [ ] Real-time inventory updates
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Coupon/promotion system

### Long Term
- [ ] AI-powered product recommendations
- [ ] Multi-vendor marketplace
- [ ] Internationalization (i18n)
- [ ] AR product visualization
- [ ] Voice search integration

---

## Developer Notes

### Important Assumptions

1. **Demo Mode:** Both applications are in demo mode with mock data
2. **Single Tenant:** No multi-store or multi-tenant support planned
3. **Indian Market:** Currency (₹), phone format (+91), Indian brands considered
4. **No SSR for Admin:** Admin uses client-side React only
5. **Shared Design Language:** Both apps use similar color palette (VolteX teal: #49A5A2)

### Coding Conventions

1. **File Naming:**
   - Components: PascalCase (`ProductInfo.tsx`)
   - Utilities: camelCase (`utils.ts`)
   - Types: camelCase (`types.ts`)

2. **Component Patterns:**
   - Client components: Use 'use client' directive
   - Server components: Default (no directive)
   - Admin components: Standard React

3. **Styling:**
   - Tailwind CSS for all styling
   - Dark theme primary for client
   - Light theme with card backgrounds for admin
   - shadcn/ui components as base

4. **Icons:**
   - Hugeicons library throughout
   - Import from `@hugeicons/core-free-icons`
   - Use `HugeiconsIcon` wrapper component

5. **TypeScript:**
   - Strict typing with interfaces
   - Avoid `any` type
   - Export types from `lib/types.ts`

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Appendix: Type Definitions

### Client Types (lib/types.ts)

```typescript
// Product Types
interface ProductDetail {
    id: string;
    title: string;
    slug: string;
    category: string;
    categorySlug: string;
    subcategory?: string;
    brand: string;
    images: ProductDetailImage[];
    price: number;
    originalPrice: number;
    discount: string;
    savings: string;
    rating: string;
    reviews: string;
    deliveryDate: string;
    deliveryFee?: string;
    inStock: boolean;
    bankOffers: BankOffer[];
    highlights: ProductHighlight[];
    specGroups: ProductSpecGroup[];
    variants?: ProductVariantGroup[];
    relatedProductIds: string[];
    emiStartsAt?: string;
    warranty?: string;
}
```

### Admin Types (lib/types.ts)

```typescript
type Role = "super_admin" | "product_manager";

interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
}

interface NavItem {
    label: string;
    path: string;
    icon: string;
    roles: Role[];
}
```

---

*Documentation generated: March 2026*
*VolteX E-Commerce Platform v1.0*
