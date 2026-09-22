# VolteX Storefront — Design System

The single source of truth for how the **client** package looks and behaves. Read this before building or modifying any customer-facing UI.

This system is **descriptive first** — it documents the patterns already shipped across `app/` and `components/` — and **prescriptive going forward**: new code uses the tokens and recipes below, not new one-off values.

> Scope: `client/` only. The admin dashboard has its own conventions.

---

## 1. Core principles

1. **Token first.** If a value exists as a token (`bg-brand`, `text-muted-foreground`), use it. Never introduce a new raw hex.
2. **Two shells, one language.** Every page is either a *Dark shell* or a *Light shell* (§3). Pick one per route — never mix within a page body.
3. **Compose, don't fork.** Reuse `HomeProductCard`, `ProductListingTemplate`, `AccountSidebar` before writing a new variant.
4. **Small tweaks over rewrites.** Extend an existing component with a prop; don't clone it.
5. **Every async surface has four states**: loading → empty → error → content (§10).
6. **Mobile is the default breakpoint.** Write the phone layout, then add `sm:` / `lg:`.

---

## 2. Design tokens

Tokens live in [globals.css](app/globals.css) as CSS custom properties, exposed to Tailwind through `@theme inline`.

### 2.1 Brand

| Token | Utility | Value | Use |
|---|---|---|---|
| `--brand` | `bg-brand` `text-brand` `border-brand` | `#49A5A2` | Primary CTAs, links, active states, prices-on-offer, discount badges |
| `--brand-hover` | `hover:bg-brand-hover` | `#3D8E8B` | Hover state of any filled brand surface |
| `--brand-foreground` | `text-brand-foreground` | `#FFFFFF` | Text/icons on a filled brand surface |
| `--brand-muted` | `bg-brand-muted` | `#49A5A2` @ 10% | Tinted brand chips, rating pills, soft badges |

Opacity modifiers work: `bg-brand/10`, `border-brand/20`, `text-brand/70`.

> **Legacy:** 42 files still hardcode `#49A5A2` and two different hovers (`#3d8e8b`, `#3d8d8a`). Those are grandfathered. **Never add a 283rd.** When you touch one of those lines for another reason, swap it to `bg-brand` / `hover:bg-brand-hover`.

### 2.2 Surfaces

Dark shell (the default storefront look):

| Token | Utility | Value | Use |
|---|---|---|---|
| `--surface-page` | `bg-surface-page` | `#0F0F0F` | Page background, section backgrounds |
| `--surface-raised` | `bg-surface-raised` | `#1A1A1A` | Cards, dropdowns, modals, mega-menu panels |
| `--surface-hover` | `bg-surface-hover` | `#252525` | Hover state of a raised surface |
| — | `bg-white/5` … `/10` | — | Subtle inset fills (icon tiles, input wells) |
| — | `border-white/10` | — | Default hairline border on dark |
| — | `border-white/20` | — | Emphasised border / focus-adjacent |

Light shell (transactional pages):

| Utility | Value | Use |
|---|---|---|
| `bg-surface-page-light` | `#F5F5F5` | Page background |
| `bg-white` | — | Cards and panels |
| `border-gray-100` | — | Default card border |
| `border-gray-200` | — | Card border on hover |

### 2.3 Text

| Context | Dark shell | Light shell |
|---|---|---|
| Primary | `text-white` | `text-gray-900` |
| Secondary | `text-white/70` | `text-gray-600` |
| Tertiary / meta | `text-white/50` | `text-gray-500` |
| Disabled / strikethrough MRP | `text-white/40` | `text-gray-400` |
| Accent / link | `text-brand` | `text-brand` |
| Error | `text-red-400` | `text-red-500` |

Do not invent new opacity steps. The ladder is **100 / 70 / 50 / 40** on dark.

### 2.4 Radius

`--radius: 0.625rem` (10px). The scale is derived from it.

| Utility | Size | Use |
|---|---|---|
| `rounded-full` | — | Pills, badges, avatars, icon buttons |
| `rounded-xl` | 14px | **Cards, panels, product tiles, large CTAs** |
| `rounded-lg` | 10px | **Buttons, inputs, small cards** |
| `rounded-md` | 8px | Badges on imagery, dropdown items |
| `rounded-2xl` | 18px | Modals, hero-scale surfaces only |

### 2.5 Shadow

Dark UI uses shadow sparingly — depth comes from `--surface-raised` + border.

- Floating panel (dropdown, mega-menu): `shadow-[0_20px_60px_rgba(0,0,0,0.5)]`
- Modal / overlay: `shadow-[0_32px_80px_rgba(0,0,0,0.6)]`
- Light-shell cards: **no shadow** — use `border-gray-100`.

---

## 3. Page shells

Every route picks exactly one. This is the highest-level decision when adding a page.

### 3.1 Dark shell — browsing & identity

Used by: home, product detail, category, search, login, all `(account)` pages.

```tsx
<div className="flex w-full max-w-full flex-1 flex-col items-center bg-surface-page min-h-screen">
  <Navbar />
  <main className="w-full max-w-7xl px-4 py-8">
    {/* content */}
  </main>
  <Footer className="w-full self-stretch mt-auto" />
</div>
```

### 3.2 Light shell — transactional

Used by: cart, checkout, order success. Rationale: high-focus money pages read as "receipt paper", separating them from browsing.

```tsx
<div className="flex w-full max-w-full flex-1 flex-col items-center bg-surface-page-light min-h-screen">
  <Navbar />
  <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">PAGE TITLE</h1>
    {/* content */}
  </main>
  <Footer className="w-full self-stretch mt-auto" />
</div>
```

**`Navbar` and `Footer` are always dark**, in both shells. Do not restyle them per page.

### 3.3 Account sub-shell

`app/(account)/layout.tsx` wraps children in `ProtectedPage` + a 260px sidebar. New account pages only export the inner content — never their own `Navbar`/`Footer`.

---

## 4. Layout & spacing

| Concern | Rule |
|---|---|
| Content width | `max-w-7xl` (1280px), centered. `max-w-[1400px]` only for full-bleed hero/carousel rails. |
| Gutter | `px-4` everywhere. Transactional pages may step up: `px-4 sm:px-6 lg:px-8`. |
| Section rhythm | `py-8` between homepage sections. `py-12` for a deliberate breather. Never `py-10`/`py-14`. |
| Grid gap | `gap-3` product grids · `gap-4` form/card grids · `gap-6` / `lg:gap-8` page columns |
| Inline gap | `gap-1.5` icon+label · `gap-2` default · `gap-3` loose |
| Card padding | `p-5` (light cards) · `p-4` / `p-6` (dark panels) |

**Breakpoints in real use: `sm` (640) and `lg` (1024).** `md` and `xl` are avoided — don't add a third stop unless the layout genuinely breaks.

Canonical product grid:

```tsx
<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
```

---

## 5. Typography

Fonts are loaded in [app/layout.tsx](app/layout.tsx): **Inter** as `--font-sans` (everything), Roboto/Geist available but unused in practice. `html` is `font-sans antialiased`.

The scale is **pixel-literal** — this is intentional for retail density and matches the reference storefronts.

| Role | Class | Weight |
|---|---|---|
| Page title | `text-2xl` / `text-[22px]` | `font-bold` |
| Section heading | `text-lg` | `font-bold` |
| Card title / product name | `text-[13px]` → `sm:text-sm` | `font-medium` |
| Price (primary) | `text-base` / `text-[15px]` | `font-bold` |
| Price (MRP strike) | `text-xs` | `font-normal` + `line-through` |
| Body | `text-sm` / `text-[14px]` | `font-normal` |
| Meta / caption | `text-xs` / `text-[12px]` | `font-medium` |
| Badge / micro-label | `text-[11px]` / `text-[10px]` | `font-semibold` · `uppercase tracking-wide` |
| Hero display | `text-3xl` → `text-4xl` | `font-black` |

Weights: **medium (labels) · semibold (emphasis) · bold (headings, prices)**. `font-black` is hero-only. Never `font-extrabold`.

Long text truncates with `line-clamp-2` (product names) or `truncate` (single line).

---

## 6. Components

### 6.1 The three button tiers

**shadcn `<Button>` is deliberately micro-sized** (`h-7`, `text-xs`). It is for *dense chrome*, not commerce CTAs. Know which tier you need:

**Tier 1 — Primary CTA** (Add to Cart, Place Order, Continue). Hand-rolled, full-width in panels:

```tsx
<button
  className="w-full py-3 rounded-xl bg-brand text-brand-foreground text-[15px] font-bold
             transition-colors hover:bg-brand-hover cursor-pointer
             disabled:opacity-50 disabled:cursor-not-allowed
             flex items-center justify-center gap-2"
>
```

Compact variant (inline, in-card): `py-2.5 rounded-lg text-[13px] font-semibold`.

**Tier 2 — Secondary**: same geometry, `border border-white/10 bg-white/5 text-white hover:bg-white/10` (dark) or `border border-gray-200 bg-white text-gray-900 hover:border-gray-300` (light).

**Tier 3 — shadcn `<Button>`**: toolbar actions, filter chips, dropdown triggers, navbar controls. Use `variant`/`size` props; do not override height.

**Text link / tertiary action**: `text-brand text-sm font-semibold hover:underline`.

Every clickable non-`<button>` element needs `cursor-pointer`.

### 6.2 Cards

Product card → **always `HomeProductCard`**. It owns aspect ratio, discount badge, price block, rating pill, and hover zoom. Extend via `imageAspect` (`"square" | "tall"`) and `className`.

Light-shell content card:
```tsx
<div className="bg-white rounded-xl border border-gray-100 p-5">
```
Sticky summary variant appends `lg:sticky lg:top-24`.

Dark-shell content card:
```tsx
<div className="rounded-xl border border-white/10 bg-surface-raised p-5">
```

### 6.3 Badges & pills

| Kind | Recipe |
|---|---|
| Discount (on image) | `absolute left-2 top-2 z-10 rounded-md bg-brand px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-white` |
| Rating | `inline-flex items-center gap-1 rounded bg-brand/15 px-1.5 py-0.5 text-[0.65rem] font-semibold text-brand` + `★` |
| Soft tag | `rounded-full bg-brand/10 border border-brand/20 px-2 py-0.5 text-[11px] font-semibold text-brand` |
| Order status | `rounded-full px-2 py-0.5 text-[11px] font-semibold` + semantic color (§6.6) |

### 6.4 Forms

Use shadcn `Input`, `Label`, `Select`, `Checkbox`, `RadioGroup`, `Textarea`. On dark shells, add `bg-white/5 border-white/10 text-white placeholder:text-white/40`.

- Label above field, `text-[13px] font-medium`.
- Error below field, `text-xs text-red-400` (dark) / `text-red-500` (light).
- Validate on submit, not on keystroke. Disable the submit button while in flight and show inline spinner text ("Placing order…").

### 6.5 Icons

**HugeIcons only** — `@hugeicons/react` + `@hugeicons/core-free-icons`. 43 files use it; lucide is not installed. Never introduce a second icon library.

```tsx
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart01Icon } from "@hugeicons/core-free-icons";

<HugeiconsIcon icon={ShoppingCart01Icon} size={20} strokeWidth={1.8} />
```

Sizes: `16` inline with text · `20` default UI · `24` navbar/feature.

### 6.6 Semantic status colors

| Meaning | Color |
|---|---|
| Success / delivered / in stock | `text-emerald-400` · `bg-emerald-500/10` |
| Pending / processing | `text-amber-400` · `bg-amber-500/10` |
| Shipped / info | `text-brand` · `bg-brand/10` |
| Cancelled / failed / out of stock | `text-red-400` · `bg-red-500/10` |
| Star rating fill | `#FBBF24` (amber-400) |

### 6.7 `components/ui/` is off-limits

Generated shadcn primitives. Never hand-edit. Restyle at the call site with `className`, or wrap in a project component under `components/shared/`.

---

## 7. Motion

Restrained and fast. The catalogue:

- Color/border transitions: `transition-colors` (default 150ms)
- Product image hover: `transition-transform duration-300 group-hover:scale-105`
- Panel entrance: `animate-in fade-in zoom-in-95` (via `tw-animate-css`)
- Offer marquee: `animate-offer-marquee` (45s linear infinite, defined in globals.css)
- Buttons: `active:translate-y-px`

No spring physics, no parallax, nothing over 300ms except the marquee.

---

## 8. Data formatting

Currency is **INR, `en-IN` grouping, no decimals**:

```ts
`₹${value.toLocaleString("en-IN")}`   // ₹1,24,999
```

> This helper is currently duplicated as a local `inr()` in several components. When adding the next one, promote it to `lib/utils.ts` as `formatINR()` and import it instead.

- Discount %: `Math.round(((mrp - price) / mrp) * 100)` — render only when `mrp > price`.
- Rating: `rating.toFixed(1)` — render only when `> 0`.
- Dates: `date-fns` (`format(d, "d MMM yyyy")`).
- Prices arrive from the API as strings — always coerce through a `Number.isFinite` guard.

---

## 9. Composition rules

| Need | Use |
|---|---|
| Any class merging | `cn()` from [lib/utils.ts](lib/utils.ts) — always, even for static strings with conditionals |
| Product listing page | `components/shared/ProductListingTemplate.tsx` |
| Auth gate on a route | Wrap in `ProtectedPage`, or call `useAuth().openLoginModal()` for a soft prompt |
| Toast feedback | `sonner` — `toast.success()` / `toast.error()`. Mounted top-right in root layout. |
| Cart badge refresh | Dispatch `CART_UPDATED_EVENT` from `lib/cart-events.ts` after any mutation |
| Horizontal rail | `hooks/use-horizontal-carousel.ts` + `.scrollbar-none` utility |
| Search input debounce | `hooks/use-debounce.ts` |
| Viewport branch | `hooks/use-mobile.ts` (avoid — prefer CSS breakpoints) |

Server Components fetch data and pass it down; `"use client"` only where there is interactivity. Homepage sections are async Server Components that **`try/catch` their fetch and return `null` on empty** — a failed section disappears rather than breaking the page. Follow that pattern for new sections.

---

## 10. The four states

Every data-backed surface implements all four. Skipping one is a review blocker.

1. **Loading** — shadcn `Skeleton` matching the real layout's shape. Never a centered spinner on a full page.
2. **Empty** — icon + one-line explanation + a brand CTA back into the funnel ("Browse products").
3. **Error** — short message + `<button className="text-brand text-sm hover:underline">Try again</button>` wired to a retry.
4. **Content**.

---

## 11. Accessibility baseline

- Interactive elements are `<button>` or `<Link>` — never a clickable `<div>`.
- Icon-only controls need `aria-label`.
- Product card links carry `aria-label={product.name}`.
- Focus is visible: `focus-visible:ring-2 focus-visible:ring-brand/40` on custom controls (shadcn handles its own).
- Sections use `<section aria-label="...">`; one `<h1>` per page.
- Images: `next/image` with real `alt` and explicit `sizes` for `fill`.

---

## 12. Adding a new feature — checklist

1. **Shell** — dark (§3.1) or light (§3.2)? Account page → inner content only.
2. **Reuse pass** — does `HomeProductCard` / `ProductListingTemplate` / an existing account client already do this? Extend it with a prop.
3. **Tokens only** — `bg-brand`, `bg-surface-raised`, `text-white/70`. Zero new hex values.
4. **Width & rhythm** — `max-w-7xl px-4`, sections `py-8`.
5. **Type** — pick from the §5 table; don't invent a pixel size.
6. **Radius** — `rounded-xl` cards, `rounded-lg` controls, `rounded-full` pills.
7. **Buttons** — choose the tier (§6.1). Commerce CTA ≠ shadcn `<Button>`.
8. **Icons** — HugeIcons.
9. **Four states** (§10) + `cursor-pointer` + `disabled:` styling.
10. **Responsive** — verify at 375px and 1440px; only `sm:`/`lg:`.
11. **A11y** (§11).
12. `npm run lint` clean, no `console.log`.

---

## 13. Known debt

Tracked so it gets paid down opportunistically — not a licence to add more.

| Debt | Scale | Fix |
|---|---|---|
| Hardcoded `#49A5A2` | 282 uses / 42 files | Swap to `bg-brand` when touching a file |
| Two hover teals (`#3d8e8b`, `#3d8d8a`) | 21 uses | Consolidate on `--brand-hover` |
| Duplicated `inr()` helper | ~6 components | Promote to `formatINR()` in `lib/utils.ts` |
| `--primary` token unused by feature code | — | Feature code uses `--brand`; `--primary` stays for shadcn primitives |
| `next-themes` installed, no toggle | — | Dark shell is currently hardcoded, not theme-driven |
| Pixel-literal type sizes alongside Tailwind scale | ~180 uses | Acceptable; keep to the §5 table |

---

## 14. Changing the system

The design system is not frozen — but a change is a **deliberate edit to this file**, not a one-off in a component.

To change a color, radius, or scale step:
1. Edit the token in [app/globals.css](app/globals.css).
2. Update the relevant table here.
3. Note it in §13 if it leaves partially-migrated code behind.

If you find yourself writing a value that isn't in this document, that's the signal: either use the nearest token, or amend the system. Don't quietly do a third thing.
