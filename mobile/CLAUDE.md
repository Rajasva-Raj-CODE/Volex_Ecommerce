@AGENTS.md
@../CLAUDE.md

# VolteX E-Commerce — Mobile

## Overview

Customer storefront for iOS and Android. Expo SDK 57 + React Native 0.86 + React 19,
Expo Router for navigation, NativeWind for styling. Talks to the same Express API as
the web client and admin dashboard.

**Status (September 2026):** Browse-only milestone. Quick-commerce (Blinkit-style)
visual language on native platform navigation. Home, search, category listing and
product detail are wired to real APIs. No auth, no cart, no checkout yet.

## Commands

```bash
npx expo start          # dev server — scan the QR with Expo Go
npm run ios             # open in the iOS simulator
npm run android         # open in the Android emulator
npm run lint            # expo lint (eslint-config-expo)
npm run typecheck       # tsc --noEmit
npx expo-doctor         # dependency/config diagnostics
```

Runs in **Expo Go** — nothing here needs a custom dev build yet. That changes the
moment Razorpay goes in (`react-native-razorpay` has native code).

## Structure

```
mobile/
├── src/
│   ├── app/                        # Expo Router — every file here is a route
│   │   ├── _layout.tsx             # root Stack (detail screens push over tabs)
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx         # NativeTabs — real UITabBarController
│   │   │   ├── (home)/             # each tab is a group with its own Stack
│   │   │   │   ├── _layout.tsx     # headerShown: false — StoreHeader is the header
│   │   │   │   └── index.tsx       # promise header, category grid, rails
│   │   │   └── (search)/
│   │   │       ├── _layout.tsx
│   │   │       └── index.tsx       # native search controller, 2-col grid
│   │   ├── product/[slug].tsx      # gallery, specs, variants, offers, reviews
│   │   └── category/[slug].tsx     # products in a category + its children
│   ├── design/                     # the design system — see DESIGN_SYSTEM.md
│   │   ├── tokens.ts               # color/type/space/radius/shadow
│   │   ├── motion.ts               # durations, easing, springs, stagger
│   │   ├── Icon.tsx                # SF Symbols (iOS) / Material (Android)
│   │   └── haptics.ts
│   ├── components/
│   │   ├── StoreHeader.tsx         # teal promise header + pinned compact bar
│   │   ├── PressableScale.tsx      # spring press feedback
│   │   ├── Skeleton.tsx            # shimmer loading placeholders
│   │   ├── ProductCard.tsx         # ribbon, image well, price/ADD row
│   │   └── States.tsx              # Loading / Error / Empty
│   ├── hooks/useAsync.ts           # fetch + abort + loading/error state
│   └── lib/
│       ├── api.ts                  # mirrors client/lib/api.ts
│       ├── catalog-api.ts          # products, categories, reviews
│       └── format.ts               # ₹ formatting, discount %, rating
├── DESIGN_SYSTEM.md                # read before touching any screen
├── global.css                      # NativeWind entry (Tailwind directives)
├── tailwind.config.js              # mirrors src/design/tokens.ts
├── babel.config.js                 # babel-preset-expo + nativewind/babel
└── metro.config.js                 # withNativeWind
```

Keep non-route code out of `src/app/` — Expo Router treats every file there as a screen.

## API integration

`src/lib/api.ts` is a deliberate port of `client/lib/api.ts`: same `{ success, message, data }`
envelope, same `ApiError` class, `apiRequest` unwraps `.data`. Two differences:

- base URL comes from `EXPO_PUBLIC_API_URL` (not `NEXT_PUBLIC_API_URL`)
- every request has a 15s timeout and accepts an `AbortSignal`, because phones drop
  off networks in a way browsers mostly don't

**When the server's response shape changes, both `client/lib/` and `mobile/src/lib/`
need the edit.** They are not shared code.

### Pointing the app at the API

`localhost` means the *device*, not your Mac:

| Target | `EXPO_PUBLIC_API_URL` |
|--------|----------------------|
| iOS simulator | `http://localhost:8000/api` |
| Android emulator | `http://10.0.2.2:8000/api` |
| Physical device | `http://<your-LAN-ip>:8000/api` |

Anything prefixed `EXPO_PUBLIC_` is inlined into the bundle — never put secrets there.

## Styling

**[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) is the contract — read it before touching a screen.**

Short version: a quick-commerce layout model (branded promise header, light canvas
with white cards, dense 4-up category grid, compact cards with an inline ADD, sticky
buy bar) on native interaction (platform tab bar, per-tab stacks, platform search
controller, SF Symbols, haptics), with a Reanimated motion layer — press springs,
a collapsing header, staggered entrances and shimmer skeletons.

**Two rules when adding animation** (DESIGN_SYSTEM.md §5): gate entering builders
behind `useReducedMotion()` *and* use configs from `motion.ts`; and use shared
values via `.get()`/`.set()`, never `.value` — the React Compiler lint fails the
build on direct assignment.

The brand teal `#49A5A2` is the one thing shared with
[client/DESIGN_SYSTEM.md](../client/DESIGN_SYSTEM.md) — everything else is its own
system. Blinkit's yellow/green was deliberately **not** adopted; we took the layout
model, not another company's brand colours.

Values live in [src/design/tokens.ts](src/design/tokens.ts); `tailwind.config.js`
mirrors them. Platform-dependent values (`shadow`, `HIT_SLOP_MIN`) are only in
`tokens.ts` — not reachable from a Tailwind class.

NativeWind is kept for layout utilities (`flex-row`, `items-center`). Anything
carrying a design value goes through `tokens.ts`.

## ⏳ Not built yet

- Dark mode — tokens are light-only (see DESIGN_SYSTEM.md §6)
- Dynamic Type / font scaling — sizes are fixed points
- Auth (customer login/register, JWT + refresh, secure token storage)
- Cart and wishlist
- Checkout + Razorpay (needs a dev build — native module)
- Orders, addresses, account
- Pagination / infinite scroll on search and category (currently capped at 20/40)
- App icon and splash — still the Expo template defaults
- Offline handling beyond the request timeout
