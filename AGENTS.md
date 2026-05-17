# Repository Guidelines

## Project Structure & Module Organization
This repo is a TypeScript monorepo with four top-level packages:
- `client/`: customer storefront (Next.js App Router). Main code in `app/`, reusable UI in `components/`, shared helpers in `lib/`.
- `admin/`: admin dashboard (Vite + React). Route pages in `src/pages/`, shared UI in `src/components/`, utilities/API clients in `src/lib/`.
- `server/`: Express + Prisma API. Entry points in `src/index.ts` and `src/app.ts`, feature modules in `src/modules/*`, DB schema/migrations in `prisma/`.
- `mobile/`: scaffolded placeholder (`index.ts`) for future React Native work.

Do not hand-edit generated output in `server/dist/`.

## Build, Test, and Development Commands
Run commands inside each package directory:
- `npm run dev`: starts local dev server (`client` on :3000, `admin` on :3002, `server` on :8000).
- `npm run build`: production build (`next build`, `vite build`, or `tsc`).
- `npm run lint`: ESLint checks for the package.
- Server DB workflow: `npm run db:generate`, `npm run db:migrate`, `npm run db:seed`, `npm run db:studio`.

Example:
```bash
cd server && npm run dev
```

## Coding Style & Naming Conventions
- Language: TypeScript across all packages.
- Formatting: follow ESLint configs in each package; fix lint issues before opening PRs.
- Naming: React components use `PascalCase` (e.g., `ProductInfo.tsx`), hooks use `use*` (e.g., `use-mobile.ts`), route/module folders use descriptive lowercase names.
- Keep feature code within its package boundary; share API/type contracts intentionally via `lib/` patterns.

## Testing Guidelines
There is currently no committed automated unit/integration test suite. Minimum validation for every change:
- run `npm run lint` in touched packages;
- for API work, execute critical flows from `server/API_TESTING.md` (auth, forgot/reset password, category/product CRUD, cart/wishlist/coupons/orders/payments/reviews paths);
- document manual test steps and results in the PR.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commit-style prefixes: `feat:`, `fix:`, `refactor:`, `chore:`. Keep messages imperative and scoped.

PRs should include:
- concise summary and affected package(s);
- linked issue/task (if available);
- screenshots/videos for `client/` or `admin/` UI changes;
- API examples (curl/Postman) for `server/` changes;
- migration/env updates when Prisma schema or configuration changes.
