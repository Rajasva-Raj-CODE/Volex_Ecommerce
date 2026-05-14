@../CLAUDE.md

# VolteX E-Commerce — Server

## Overview

Express.js REST API serving both the customer storefront and admin dashboard. All core e-commerce APIs are implemented — auth, products, categories, cart, wishlist, orders, payments, uploads, and dashboard analytics.

**Status:** Production-ready core. Missing: reviews API, coupons, forgot-password, order emails, profile update, automated tests.

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Express.js | 4.21.1 |
| Language | TypeScript | 5.6.3 |
| ORM | Prisma Client | 5.22.0 |
| Database | PostgreSQL | via Prisma Accelerate |
| Auth | JWT (jsonwebtoken) | 9.0.2 |
| Hashing | bcryptjs | 2.4.3 |
| Validation | Zod | 3.23.8 |
| Security | Helmet + CORS + Rate Limiting | — |
| Email | Resend | 4.0.1 |
| Storage | Supabase Storage | HTTPS API |
| Payments | Razorpay | HTTPS API |
| Logging | Morgan | 1.10.0 |

## Commands

```bash
npm run dev           # tsx watch — hot-reload dev server on :8000
npm run build         # tsc → /dist
npm run start         # node dist/index.js
npm run lint          # ESLint
npm run db:generate   # prisma generate (regenerate client)
npm run db:migrate    # prisma migrate dev
npm run db:seed       # Seed admin user from ADMIN_SEED_* env vars
npm run db:studio     # Prisma Studio GUI
```

## Project Structure

```
server/
├── src/
│   ├── index.ts                    # Entry point — starts Express server
│   ├── app.ts                      # Express app setup (middleware + routes)
│   ├── config/
│   │   ├── env.ts                  # Zod-validated environment variables
│   │   └── prisma.ts               # Prisma client singleton
│   ├── middleware/
│   │   ├── auth.middleware.ts       # requireAuth — JWT verification → req.user
│   │   ├── requireRole.middleware.ts # requireRole(...roles) — RBAC guard
│   │   ├── error.middleware.ts      # Global error handler (ZodError, AppError, 500)
│   │   ├── validate.middleware.ts   # validate(zodSchema) — request body validation
│   │   └── rateLimiter.ts          # general (100/min), auth (10/15min), otp (5/15min)
│   ├── modules/                    # Feature modules (routes → controller → service → schema)
│   │   ├── auth/                   # Login, refresh, logout, me, customer register/login
│   │   ├── invitations/            # Staff invitations + OTP auth
│   │   ├── products/               # CRUD + search/filter/paginate
│   │   ├── categories/             # CRUD + tree/flat views
│   │   ├── cart/                   # Add, update quantity, remove, clear
│   │   ├── wishlist/               # Add, remove, list
│   │   ├── addresses/              # CRUD with default flag
│   │   ├── orders/                 # Place (with stock tx), list, status updates
│   │   ├── payments/               # Razorpay order creation + signature verification
│   │   ├── uploads/                # Image upload to Supabase (base64)
│   │   ├── users/                  # List customers (admin)
│   │   └── dashboard/              # Summary analytics
│   ├── services/
│   │   └── email.service.ts        # Resend wrapper — staff invite + OTP emails
│   └── utils/
│       ├── jwt.ts                  # signAccessToken, signRefreshToken, verify*
│       ├── otp.ts                  # generateOtp, hashOtp, verifyOtp, otpExpiresAt
│       └── response.ts            # success() and error() response helpers
├── prisma/
│   ├── schema.prisma               # Full database schema (9 models, 4 enums)
│   └── seed.ts                     # Seeds admin user
├── dist/                           # Compiled output (DO NOT EDIT)
├── .env / .env.example
├── vercel.json                     # Vercel serverless deployment config
├── package.json
└── tsconfig.json
```

## Module Pattern

Every feature module follows this structure:
```
modules/{feature}/
├── {feature}.routes.ts       # Express router with middleware chains
├── {feature}.controller.ts   # Request handlers (parse req, call service, send response)
├── {feature}.service.ts      # Business logic + Prisma queries
└── {feature}.schema.ts       # Zod validation schemas
```

## API Endpoints Reference

### Auth (`/api/auth`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /login | Public | Admin/Staff email+password login |
| POST | /refresh | Public | Refresh token rotation |
| POST | /logout | Public | Invalidate refresh token |
| GET | /me | Bearer | Get current user profile |
| POST | /customer/register | Public | Customer registration → auto-login |
| POST | /customer/login | Public | Customer email+password login |

### Invitations (`/api/invitations`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | / | Admin | Invite staff by email |
| GET | / | Admin | List all invitations |
| DELETE | /:id | Admin | Revoke invitation |
| POST | /auth/request-otp | Public (rate limited) | Staff requests OTP |
| POST | /auth/verify-otp | Public (rate limited) | Staff verifies OTP → JWT |

### Products (`/api/products`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | / | Public | List + search + filter + paginate |
| GET | /:id | Public | Get by ID or slug |
| POST | / | Admin/Staff | Create product |
| PUT | /:id | Admin/Staff | Update product |
| DELETE | /:id | Admin | Delete product |

**Query params:** `page`, `limit`, `search`, `categoryIds`, `brand`, `minPrice`, `maxPrice`, `inStock`, `sortBy`, `sortOrder`

### Categories (`/api/categories`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | / | Public | Tree structure (3 levels) |
| GET | /flat | Public | Flat list for dropdowns |
| GET | /admin | Admin/Staff | Paginated with search |
| GET | /:id | Public | Single category |
| POST | / | Admin | Create category |
| PUT | /:id | Admin | Update category |
| DELETE | /:id | Admin | Delete (blocked if has children/products) |

### Cart (`/api/cart`) — all require auth
| Method | Path | Description |
|--------|------|-------------|
| GET | / | Get cart with subtotal + item count |
| POST | / | Add item (upserts by productId) |
| PUT | /:productId | Update quantity |
| DELETE | /:productId | Remove item |
| DELETE | /clear | Clear entire cart |

### Wishlist (`/api/wishlist`) — all require auth
| Method | Path | Description |
|--------|------|-------------|
| GET | / | List wishlist items |
| POST | / | Add product |
| DELETE | /:productId | Remove product |

### Addresses (`/api/addresses`) — all require auth
| Method | Path | Description |
|--------|------|-------------|
| GET | / | List user's addresses |
| POST | / | Create address |
| PUT | /:id | Update address |
| DELETE | /:id | Delete address |

### Orders (`/api/orders`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | / | Customer | Place order (validates stock, decrements, clears cart — atomic tx) |
| GET | /my | Customer | Get own orders |
| GET | /:id | Auth | Get order detail (customer sees own, admin/staff see any) |
| GET | / | Admin/Staff | List all orders (filter by status/userId) |
| PUT | /:id/status | Admin/Staff | Update order status |

**Order status flow:** PENDING → CONFIRMED → SHIPPED → DELIVERED (terminal) / CANCELLED (terminal)

### Payments (`/api/payments`) — require auth
| Method | Path | Description |
|--------|------|-------------|
| POST | /razorpay/order | Create Razorpay payment order |
| POST | /razorpay/verify | Verify HMAC signature → place order with PAID status |

### Uploads (`/api/uploads`) — Admin/Staff only
| Method | Path | Description |
|--------|------|-------------|
| POST | /image | Upload base64 image to Supabase (JPEG/PNG/WebP/GIF, max 5MB) |

### Users (`/api/users`) — Admin/Staff only
| Method | Path | Description |
|--------|------|-------------|
| GET | / | List customers with search + pagination |

### Dashboard (`/api/dashboard`) — Admin/Staff only
| Method | Path | Description |
|--------|------|-------------|
| GET | /summary | Revenue, orders, customers, products, low stock, recent orders |

### Health
| Method | Path | Description |
|--------|------|-------------|
| GET | /health | API health check |

## Database Schema

```
User ──┬── CartItem
       ├── WishlistItem
       ├── Address ──── Order ──── OrderItem ──── Product
       ├── Order
       ├── RefreshToken
       └── Invitation

Category ──── Product (categoryId FK)
Category ──── Category (parentId self-ref, hierarchical)

OtpSession (standalone, linked by email)
```

**Enums:** `Role` (ADMIN/STAFF/CUSTOMER), `OtpPurpose` (STAFF_LOGIN), `OrderStatus` (PENDING/CONFIRMED/SHIPPED/DELIVERED/CANCELLED), `PaymentStatus` (PENDING/PAID/FAILED/REFUNDED)

## Authentication Architecture

- **Access tokens:** JWT, 15-minute expiry, signed with `JWT_ACCESS_SECRET`
- **Refresh tokens:** JWT, 7-day expiry, SHA256-hashed in DB, rotation on use
- **Passwords:** bcrypt 12 rounds (customers), 10 rounds (OTP)
- **OTP:** Cryptographically secure 6-digit, bcrypt hashed, 15-minute expiry
- **Middleware chain:** `requireAuth` → verifies JWT → sets `req.user` → `requireRole(...)` → checks role

## API Response Format

All endpoints return:
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... }
}
```

Errors:
```json
{
  "success": false,
  "message": "Error description",
  "errors": { "field": "validation error" }
}
```

## Security Measures

- Helmet security headers
- CORS restricted to CLIENT_URL and ADMIN_URL
- Rate limiting: 100 req/min general, 10/15min auth, 5/15min OTP
- JWT token hashing (refresh tokens stored as SHA256)
- Zod validation on all inputs
- Parameterized Prisma queries (SQL injection safe)
- HMAC-SHA256 signature verification for Razorpay
- Base64 image validation (MIME whitelist, size limit)
- `isActive` soft deletes (no hard deletes)

## Environment Variables

```env
# Database
DATABASE_URL=                    # Prisma connection string (Accelerate recommended)

# JWT
JWT_ACCESS_SECRET=               # ≥16 chars
JWT_REFRESH_SECRET=              # ≥16 chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email
RESEND_API_KEY=                  # Resend.com API key
EMAIL_FROM=                      # e.g., "VolteX <noreply@domain.com>"

# Admin Seed
ADMIN_SEED_EMAIL=
ADMIN_SEED_PASSWORD=
ADMIN_SEED_NAME=

# CORS
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3002

# Server
PORT=8000
NODE_ENV=development

# Supabase Storage
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=product-images

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

## Key Implementation Details

### Order Placement (Atomic Transaction)
1. Validate all items exist and have sufficient stock
2. Inside Prisma `$transaction`: decrement stock for each item (conditional update prevents overselling)
3. Create Order + OrderItems with price snapshot
4. Clear user's cart
5. If any step fails, entire transaction rolls back

### Image Upload Flow
1. Client sends base64 data URL + filename + folder
2. Server parses and validates MIME type (JPEG/PNG/WebP/GIF) and size (≤5MB)
3. Sanitizes filename, appends timestamp
4. Uploads to Supabase Storage via HTTPS
5. Returns public URL, path, bucket

### Razorpay Payment Flow
1. Client calls `/payments/razorpay/order` with cart details
2. Server creates Razorpay order (amount in paise, INR)
3. Client opens Razorpay Checkout modal
4. User completes payment
5. Client calls `/payments/razorpay/verify` with razorpayOrderId, paymentId, signature
6. Server verifies HMAC-SHA256 signature
7. If valid, places order with PAID status (unique constraint on paymentId prevents reuse)

## What's NOT Implemented Yet

- Product reviews/ratings API
- Coupon/promo code system
- Forgot password / password reset
- Customer profile update (name, phone, avatar)
- Order confirmation/shipping emails
- Search suggestions/autocomplete
- Razorpay webhook handler
- Bulk operations (bulk delete, bulk status update)
- Automated test suite (Jest/Vitest)
- Docker/docker-compose
