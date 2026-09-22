# VolteX Mobile — Design System

The source of truth for how the **mobile** app looks and behaves. Read this before
building or modifying any screen.

Two influences, deliberately separated:

- **Visual language: quick-commerce (Blinkit-style).** Branded promise header,
  light canvas with white cards, dense 4-up category grid, compact product cards
  with an inline ADD action, horizontal rails, sticky buy bar.
- **Interaction: native.** Real platform tab bar, per-tab stacks, the platform
  search controller, SF Symbols / Material Symbols, haptics.

> **This is not a port of [client/DESIGN_SYSTEM.md](../client/DESIGN_SYSTEM.md).**
> That describes a dark web page. The only thing shared is the brand teal, so
> VolteX stays recognisable across web, admin and app.
>
> We also did **not** adopt Blinkit's yellow/green palette — that's their brand
> identity. We took the layout model, not the colours.

---

## 1. Principles

1. **Density over air.** This is a shopping app; more product above the fold wins.
   The gutter is 12, not 16, and the type scale runs smaller than the platform default.
2. **Price and action on the same row.** Every card ends with price left, ADD right.
3. **Platform controls where the platform has one.** Tab bar, search, nav bar,
   back gesture — never rebuilt in JS.
4. **Native semantics for touch.** Haptics on navigation; opacity on iOS, ripple
   on Android.
5. **Four states on every async surface**: loading → empty → error → content.
   Loading means a skeleton in the real layout, not a spinner — nothing should jump
   when data lands.
6. **Motion explains, it doesn't perform.** Things move to show where they came
   from or that a tap registered — never to be noticed on their own. See §5.
7. **Never fake an affordance.** Cart isn't built, so ADD opens the product page
   and the buy bar is visibly disabled — it doesn't pretend to add.

---

## 2. Tokens

All values live in [src/design/tokens.ts](src/design/tokens.ts). `tailwind.config.js`
mirrors them so NativeWind classes and `StyleSheet` values can't drift. Platform-
dependent values (`shadow`, `HIT_SLOP_MIN`) exist only in `tokens.ts`, because
`Platform.select()` can't run in a Tailwind config.

### 2.1 Color

| Token | Value | Role |
|---|---|---|
| `brand` | `#49A5A2` | Header block, ADD outline, links, active tab |
| `brandDark` | `#3D8E8B` | Pressed state of a filled brand surface |
| `brandWash` | `#E9F4F4` | Category tiles, selected chips, pressed ADD |
| `onBrand` | `#FFFFFF` | Text/icons on a filled brand surface |
| `canvas` | `#F6F7F8` | Screen background behind cards |
| `card` | `#FFFFFF` | Cards, nav bar, tab bar, sticky buy bar |
| `well` | `#F2F3F5` | Image wells, disabled buttons |
| `separator` | `#ECEDEF` | Hairlines inside cards |
| `border` | `#E2E4E7` | Control borders, inactive dots |
| `label` | `#1C1C1E` | Primary text |
| `secondaryLabel` | `#6B6F76` | Supporting text |
| `tertiaryLabel` | `#9CA1A8` | Placeholder, disabled, struck-through MRP |
| `positive` / `positiveWash` | `#1B8D3A` / `#E7F5EB` | Savings, in stock, rating pill |
| `destructive` | `#D93025` | Out of stock, errors |
| `ribbon` | `#2A6DF4` | Discount ribbon on the product card image |

**Light only.** The app declares `userInterfaceStyle: "light"`. Dark mode is not
built — see §6.

### 2.2 Type

Compact commerce scale, smaller than the platform default by design.

| Token | Size / line / weight | Use |
|---|---|---|
| `hero` | 24 / 29 / 800 | Header promise, detail price |
| `title` | 19 / 24 / 700 | Product name on detail |
| `section` | 17 / 22 / 700 | Section headers, nav bar title |
| `price` | 14 / 18 / 700 | Card price, buy-bar price |
| `body` | 14 / 19 / 400 | Long-form copy, highlights |
| `cardTitle` | 13 / 17 / 500 | Product name on a card (2 lines max) |
| `action` | 13 / 16 / 700 | ADD, buttons, "See all" |
| `meta` | 12 / 15 / 400 | Brand, specs, review text |
| `micro` | 11 / 14 / 600 | Ribbon, delivery hint, rating pill |

### 2.3 Space, radius, shadow

4pt grid: `xs 4 · sm 6 · md 8 · lg 12 · xl 16 · xxl 24`. `gutter` is 12.
Screen edges use `xl` (16); gaps between cards use `lg` (12).

Radius: `sm 6 · md 10 · lg 14 · xl 18 · pill`. Cards are `lg`, controls `md`,
the header's bottom corners `xl`.

`shadow` is a soft lift — the shadow quad on iOS, `elevation` on Android.

---

## 3. Components

### Store header — [StoreHeader.tsx](src/components/StoreHeader.tsx)
The teal block that replaces the nav bar on Home. Delivery promise, then a
**Pressable** styled as a search field that hands off to the Search tab. It is
not a `TextInput`: one search implementation, and the real platform control does
the work.

### Product card — [ProductCard.tsx](src/components/ProductCard.tsx)
The signature element. Top to bottom: discount ribbon over a square image well,
delivery hint, 2-line name, brand + rating, then the price/ADD row.
`SOLD` replaces `ADD` when stock is 0, and the button is disabled.

### Cards on detail — `Card` in [product/[slug].tsx](src/app/product/[slug].tsx)
White rounded block on the canvas. Every section of the detail page is one.

### States — [States.tsx](src/components/States.tsx)
Loading / Error / Empty, each with a brand-wash icon medallion.

---

## 4. Navigation

- **Tabs**: [`NativeTabs`](src/app/(tabs)/_layout.tsx) — a real `UITabBarController`
  on iOS, Material bottom navigation on Android.
- **Per-tab stacks**: every tab is a route group (`(home)`, `(search)`) with its
  own `Stack`, so each keeps independent history.
- **Home has no platform header** — `StoreHeader` is the brand block.
- **Search** uses `headerSearchBarOptions` (real `UISearchController`).
- **Detail screens** (`product/`, `category/`) sit on the **root** stack, pushing
  over the tab bar — the common commerce pattern.

## 5. Motion

Tokens in [src/design/motion.ts](src/design/motion.ts), built on Reanimated 4.
Everything runs on the UI thread, so animation stays smooth while a screen is
still fetching.

### 5.1 Tokens

| Token | Value | Use |
|---|---|---|
| `duration.instant` | 120ms | Press feedback |
| `duration.quick` | 220ms | Fades, small moves |
| `duration.entrance` | 320ms | Content arriving on screen |
| `easing` | `bezier(0.22, 1, 0.36, 1)` | Decelerate-in, matching system curves |
| `springPress` | damping 18 / stiffness 320 | Press and release — no visible bounce |
| `springPop` | damping 10 / stiffness 380 | Confirming action (ADD) |
| `STAGGER_STEP` | 55ms | Gap between staggered siblings |
| `HEADER_COLLAPSE_DISTANCE` | 90px | Scroll at which the compact header is fully in |

### 5.2 Where motion is used

| Surface | Motion |
|---|---|
| Any pressable | [`PressableScale`](src/components/PressableScale.tsx) — springs down under the finger |
| ADD button | Scale pop on tap (`withSequence`), plus selection haptic |
| Home header | Promise text fades and drifts up as it scrolls away; a compact search bar fades in pinned at top |
| Home sections | Staggered `FadeInDown`, 55ms apart |
| Category tiles | `FadeIn`, 40ms apart |
| Product/search grids | `FadeIn`, **capped at 8 items** — past a screenful, stagger reads as lag, not sequence |
| Product detail cards | Staggered `FadeInDown` |
| Gallery dots | Active dot stretches to a pill via `withTiming` |
| Sticky buy bar | `FadeInUp` after the page settles |
| Loading | [`Skeleton`](src/components/Skeleton.tsx) — opacity pulse in the real layout |

### 5.3 Reduce Motion

Non-negotiable. Two mechanisms, because they cover different things:

- **Spring/timing configs** in `motion.ts` all carry `ReduceMotion.System`, so
  they degrade automatically — call sites don't have to remember.
- **Entering animations** (`FadeIn`, `FadeInDown`, `FadeInUp`) can't opt out on
  their own, so every call site gates them behind `useReducedMotion()` and passes
  `undefined`. The skeleton shimmer checks the same hook and holds a static tint.

**When adding animation, do both.** A config alone is not enough if you also use
an entering builder.

### 5.4 Shared values

Use `.get()` / `.set()`, not `.value`. The React Compiler lint rule
(`react-hooks/immutability`) treats direct `.value` assignment as mutating an
immutable binding and will fail the build.

### 5.5 Build requirement

`babel-preset-expo` auto-adds `react-native-worklets/plugin` when Reanimated is
installed, so [babel.config.js](babel.config.js) needs no entry for it — adding
one would double-apply the transform. If animations ever silently stop working
at runtime while the bundle still builds, that plugin is the first thing to check.

## 6. Icons

[`<Icon name="…" />`](src/design/Icon.tsx) renders SF Symbols on iOS and Material
Symbols on Android from one role-based name. **Never put a glyph character like
`★` in a `<Text>`.** Add new icons to the `ICONS` map with both platform names.

## 7. Not built

- **Dark mode.** Tokens are light-only. Supporting dark means making `tokens.ts`
  appearance-aware (`useColorScheme`) and dropping the hardcoded Tailwind colours.
- **Dynamic Type / font scaling.** Sizes are fixed points.
- **Address picker.** Quick-commerce headers normally carry one; ours doesn't,
  because `/api/addresses` needs auth and mobile has none yet. A non-functional
  location row would be a fake affordance.
- **Real ADD-to-cart.** Browse-only milestone.
- App icon and splash — still Expo template defaults.
