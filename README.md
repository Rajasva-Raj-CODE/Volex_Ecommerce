# VolteX E-Commerce Platform

A full-stack electronics e-commerce platform (inspired by Croma / Reliance Digital), built as a monorepo with separate packages for the customer-facing storefront, admin dashboard, REST API server, and mobile app.

---

## Monorepo Structure

```
Volex_Ecommerce/
├── client/          # Customer storefront — Next.js 16 (App Router)
├── admin/           # Admin dashboard  — Vite + React 19
├── server/          # REST API          — Node.js / Express (in progress)
├── mobile/          # Mobile app        — React Native (planned)
└── README.md        # This file
```

---

## Status

| Package  | Status         | Notes                                    |
|----------|---------------|------------------------------------------|
| `client` | UI complete   | All pages built, no backend integration  |
| `admin`  | UI complete   | CRUD pages built, no backend integration |
| `server` | In progress   | Scaffolded, implementation starting      |
| `mobile` | Planned       | Scaffolded, starts after server is done  |

---

## Tech Stack

### Shared Across All Packages
- **Language**: TypeScript 5
- **Package Manager**: npm

### Client (`/client`)
- Next.js 16.2 (App Router, SSR/SSG)
- React 19 + Tailwind CSS 4
- shadcn/ui (Radix UI primitives)
- Embla Carousel, HugeIcons, Sonner, next-themes

### Admin (`/admin`)
- Vite 8 + React 19 + React Router DOM 7
- Tailwind CSS 4 + shadcn/ui
- TanStack React Table, Recharts, @dnd-kit, Zod

### Server (`/server`)
- Node.js + Express (or Fastify — TBD)
- PostgreSQL + Prisma ORM (planned)
- JWT auth + bcrypt

### Mobile (`/mobile`)
- React Native + Expo (planned)
- Shares types and API client with client package

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Run Client (Storefront)
```bash
cd client
npm install
npm run dev
# http://localhost:3000
```

### Run Admin Dashboard
```bash
cd admin
npm install
npm run dev
# http://localhost:3002
```

### Run Server (when ready)
```bash
cd server
npm install
npm run dev
# http://localhost:8000
```

---

## Architecture Overview

```
┌──────────────┐     ┌──────────────┐
│   Client     │     │    Admin     │
│  Next.js 16  │     │  Vite+React  │
│  :3000       │     │  :5173       │
└──────┬───────┘     └──────┬───────┘
       │                    │
       │    REST API / JWT  │
       └────────┬───────────┘
                │
        ┌───────▼────────┐
        │    Server      │
        │  Node/Express  │
        │  :8000         │
        └───────┬────────┘
                │
        ┌───────▼────────┐
        │  PostgreSQL    │
        │  (via Prisma)  │
        └────────────────┘
```

---

## Roadmap

### Phase 1 — Frontend (DONE)
- [x] Customer storefront (Next.js) — all pages
- [x] Admin dashboard (Vite) — all CRUD pages

### Phase 2 — Backend (IN PROGRESS)
- [ ] Project setup: Express + Prisma + PostgreSQL
- [ ] Database schema: users, products, categories, orders, cart
- [ ] Auth: register, login, JWT + refresh tokens, roles
- [ ] Product APIs: CRUD, image upload, filters
- [ ] Category APIs
- [ ] Cart & Wishlist APIs
- [ ] Order APIs: place, track, history
- [ ] Admin-specific APIs (with role guard)
- [ ] Integrate client + admin with real APIs

### Phase 3 — Mobile (PLANNED)
- [ ] React Native + Expo setup
- [ ] Shared API client/types with client package
- [ ] Core screens: home, product, cart, orders, profile
- [ ] Push notifications
- [ ] App Store + Play Store deployment

### Phase 4 — Production
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker + docker-compose
- [ ] Deploy server (Railway / Render / EC2)
- [ ] Deploy client (Vercel)
- [ ] Deploy admin (Vercel / Netlify)

---

## Git Workflow

```
main          — stable, production-ready code
feature/*     — new features (e.g. feature/product-api)
fix/*         — bug fixes
```

- All changes go through PRs to `main`
- Branch naming: `feature/`, `fix/`, `chore/`

---

## Environment Variables

Each package has its own `.env.local` / `.env`. See individual package READMEs for details.

---

## Contributing

1. Fork → branch → PR
2. Follow existing code style (ESLint + Prettier)
3. Write meaningful commit messages

---

*Built with love — VolteX Team*
