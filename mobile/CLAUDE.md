@AGENTS.md
@../CLAUDE.md

# VolteX E-Commerce — Mobile

## Overview

Customer storefront for iOS and Android. Expo SDK 57 + React Native 0.86 + React 19,
Expo Router for navigation, NativeWind for styling. Talks to the same Express API as
the web client and admin dashboard.

**Status (September 2026):** Browse + auth + cart, behind a splash and welcome
gate. Quick-commerce (Blinkit-style) visual language on native platform
navigation. Home, search, category, product detail, customer auth, cart and
wishlist are wired to real APIs. No checkout yet.

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
│   │   ├── _layout.tsx             # providers, splash hold, auth gate
│   │   ├── welcome.tsx             # first-launch gate (sign in / browse)
│   │   ├── sign-in.tsx             # modal — sign in / create account
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx         # NativeTabs + cart badge
│   │   │   ├── (home)/             # each tab is a group with its own Stack
│   │   │   ├── (search)/           # platform search controller
│   │   │   ├── (cart)/             # cart lines + subtotal bar
│   │   │   └── (account)/          # profile, sign out, wishlist
│   │   ├── product/[slug].tsx
│   │   └── category/[slug].tsx
│   ├── context/
│   │   ├── OnboardingProvider.tsx  # guest-browsing flag
│   │   ├── AuthProvider.tsx        # session restore, sign in/up/out
│   │   ├── CartProvider.tsx        # reducer + optimistic writes
│   │   └── WishlistProvider.tsx
│   ├── design/                     # the design system — see DESIGN_SYSTEM.md
│   │   ├── tokens.ts               # color/type/space/radius/shadow
│   │   ├── motion.ts               # durations, easing, springs, stagger
│   │   ├── Icon.tsx                # SF Symbols (iOS) / Material (Android)
│   │   └── haptics.ts
│   ├── components/
│   │   ├── AnimatedSplash.tsx      # native-splash → app handoff
│   │   ├── StoreHeader.tsx         # teal promise header + pinned compact bar
│   │   ├── ProductCard.tsx         # ribbon, image well, price/ADD row
│   │   ├── AddToCartControl.tsx    # ADD ⇄ − qty + stepper
│   │   ├── WishlistButton.tsx
│   │   ├── PressableScale.tsx      # spring press feedback
│   │   ├── Skeleton.tsx            # shimmer loading placeholders
│   │   └── States.tsx              # Loading / Error / Empty
│   ├── hooks/useAsync.ts           # fetch + abort + loading/error state
│   └── lib/
│       ├── session.ts              # SecureStore tokens + single-flight refresh
│       ├── preferences.ts          # durable non-credential flags
│       ├── api.ts                  # envelope, ApiError, bearer + 401 retry
│       ├── auth-api.ts
│       ├── catalog-api.ts
│       ├── cart-api.ts
│       ├── wishlist-api.ts
│       └── format.ts               # ₹ formatting, discount %, rating
├── DESIGN_SYSTEM.md                # read before touching any screen
├── global.css / tailwind.config.js / babel.config.js / metro.config.js
```

Keep non-route code out of `src/app/` — Expo Router treats every file there as a screen.

## Launch & the auth gate

`SplashScreen.preventAutoHideAsync()` runs at module scope, and the native splash
is held until **both** the stored session and the guest-browsing flag have been
read. That way the first frame is the correct one — never a welcome screen that
disappears a beat later.

Once booted, [AnimatedSplash](src/components/AnimatedSplash.tsx) is drawn over the
mounted app matching the native splash exactly (same teal, same mark), then
animates away. Without it, hiding the native splash reads as a flicker.

Routing uses `Stack.Protected`:

```
gateOpen = signedIn || guestAccepted
  true  → (tabs), product/, category/
  false → welcome
```

`sign-in` sits outside both guards, because it's reachable from the welcome gate
*and* from the in-app cart prompt.

**Browsing is deliberately not gated.** A hard auth wall on a storefront stops
people seeing what's for sale; the cart is what requires an account. "Continue
browsing" sets a durable flag via [preferences.ts](src/lib/preferences.ts), so the
gate appears once. To make it a hard gate instead, drop `guestAccepted` from
`gateOpen` and remove that button.

## Auth & session

Tokens live in the OS keystore via `expo-secure-store` — a refresh token is a
7-day credential, so AsyncStorage would be wrong.

[session.ts](src/lib/session.ts) owns the pair and the refresh handshake;
[api.ts](src/lib/api.ts) attaches the bearer for `{ auth: true }` calls and
transparently retries once after a 401.

**The refresh must stay single-flight.** The server invalidates the old refresh
token on use (verified: replaying it returns "Refresh token not found or
expired"), so two parallel refreshes would race and the loser's token would
already be dead. `refreshSession()` returns the in-flight promise when one exists.

`session.ts` deliberately does **not** use `apiRequest` — that module calls back
into it, and routing the refresh through it would be infinitely recursive.

## State providers

`AuthProvider` → `CartProvider` → `WishlistProvider`, in that order (both cart
and wishlist read the session).

Cart and wishlist state is **tagged with the user id it belongs to** and derived
at read time (`isCurrent = signedIn && state.forUserId === userId`). That means
signing out empties them without a `setState` inside an effect, and a new sign-in
can never briefly show the previous customer's items. The React Compiler lint
rejects synchronous `setState` in an effect body, so this isn't optional styling.

Cart writes are optimistic: the stepper moves on the same frame as the tap and
rolls back if the request fails. The optimistic action carries a **function**, not
a value, so two taps in one frame can't both compute from the same stale base.

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

- **Checkout + Razorpay** — needs a dev build, the SDK has native code
- Orders list/detail, addresses, profile editing
- Forgot-password flow (the API wrapper exists, no screen yet)
- Pagination / infinite scroll on search and category (capped at 20/40)
- Dark mode — tokens are light-only (see DESIGN_SYSTEM.md §6)
- Dynamic Type / font scaling — sizes are fixed points
- Offline handling beyond the request timeout
