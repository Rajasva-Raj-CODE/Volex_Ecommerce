import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ApiError } from "../lib/api";
import {
  addWishlistItem,
  fetchWishlist,
  removeWishlistItem,
  type Wishlist,
} from "../lib/wishlist-api";
import { useAuth } from "./AuthProvider";

const EMPTY: Wishlist = { items: [], itemCount: 0 };

interface WishlistContextValue {
  wishlist: Wishlist;
  loading: boolean;
  has: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
  reload: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, signedIn } = useAuth();
  const userId = user?.id ?? null;

  // Tagged with the user it belongs to, so signing out empties it by derivation
  // rather than by a setState inside an effect.
  const [state, setState] = useState<{ wishlist: Wishlist; forUserId: string | null }>({
    wishlist: EMPTY,
    forUserId: null,
  });
  const [nonce, setNonce] = useState(0);

  const isCurrent = signedIn && state.forUserId === userId;
  const wishlist = isCurrent ? state.wishlist : EMPTY;
  const loading = signedIn && !isCurrent;

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();
    let active = true;

    fetchWishlist(controller.signal)
      .then((next) => {
        if (active) setState({ wishlist: next, forUserId: userId });
      })
      .catch(() => {
        // The wishlist is secondary; a failure here shouldn't interrupt
        // browsing. Mark it loaded-but-empty so the UI stops waiting.
        if (active) setState({ wishlist: EMPTY, forUserId: userId });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [userId, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  const has = useCallback(
    (productId: string) => wishlist.items.some((i) => i.productId === productId),
    [wishlist.items]
  );

  const toggle = useCallback(
    async (productId: string) => {
      if (!userId) return;
      const wasSaved = wishlist.items.some((i) => i.productId === productId);

      try {
        if (wasSaved) {
          setState((prev) => {
            const items = prev.wishlist.items.filter((i) => i.productId !== productId);
            return { ...prev, wishlist: { items, itemCount: items.length } };
          });
          await removeWishlistItem(productId);
        } else {
          await addWishlistItem(productId);
          setState({ wishlist: await fetchWishlist(), forUserId: userId });
        }
      } catch (err) {
        // 409 means it was already saved — the server and we agree on the end
        // state, so treat it as success rather than bouncing the heart back.
        if (err instanceof ApiError && err.status === 409) return;
        reload();
        throw err;
      }
    },
    [wishlist.items, reload, userId]
  );

  const value = useMemo<WishlistContextValue>(
    () => ({ wishlist, loading, has, toggle, reload }),
    [wishlist, loading, has, toggle, reload]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
