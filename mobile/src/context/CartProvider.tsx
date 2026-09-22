import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { ApiError } from "../lib/api";
import {
  addCartItem,
  clearCart as clearCartRequest,
  fetchCart,
  removeCartItem,
  updateCartItem,
  type Cart,
  type CartItem,
} from "../lib/cart-api";
import { useAuth } from "./AuthProvider";

const EMPTY_CART: Cart = { items: [], subtotal: 0, itemCount: 0 };

interface CartContextValue {
  cart: Cart;
  loading: boolean;
  error: string | null;
  /** Quantity of a product in the cart, 0 if absent. */
  quantityOf: (productId: string) => number;
  /** True while a specific product's row is being written. */
  isPending: (productId: string) => boolean;
  add: (productId: string) => Promise<void>;
  setQuantity: (productId: string, quantity: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  reload: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Subtotal is derived client-side so optimistic edits stay consistent. */
function recompute(items: CartItem[]): Cart {
  return {
    items,
    subtotal: items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0),
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

interface State {
  cart: Cart;
  /** The cart to restore if the in-flight write fails. */
  rollback: Cart | null;
  /** Which user's cart this is, so a stale one is never shown to the next. */
  forUserId: string | null;
  error: string | null;
}

type Action =
  | { type: "loaded"; cart: Cart; forUserId: string }
  | { type: "loadFailed"; message: string; forUserId: string }
  /**
   * Carries a function rather than a value: the reducer applies it to the
   * latest state, so two taps in the same frame can't both compute from the
   * same stale base.
   */
  | { type: "optimistic"; apply: (cart: Cart) => Cart }
  | { type: "commit" }
  | { type: "rollback"; message: string };

const INITIAL: State = { cart: EMPTY_CART, rollback: null, forUserId: null, error: null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "loaded":
      return { cart: action.cart, rollback: null, forUserId: action.forUserId, error: null };
    case "loadFailed":
      return { ...state, forUserId: action.forUserId, error: action.message };
    case "optimistic":
      return { ...state, rollback: state.cart, cart: action.apply(state.cart), error: null };
    case "commit":
      return { ...state, rollback: null, error: null };
    case "rollback":
      return {
        ...state,
        cart: state.rollback ?? state.cart,
        rollback: null,
        error: action.message,
      };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, signedIn } = useAuth();
  const userId = user?.id ?? null;

  const [state, dispatch] = useReducer(reducer, INITIAL);
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [nonce, setNonce] = useState(0);

  // Derived, not stored: signing out empties the cart without a setState in an
  // effect, and a new sign-in can't briefly show the previous user's items.
  const isCurrent = signedIn && state.forUserId === userId;
  const cart = isCurrent ? state.cart : EMPTY_CART;
  const loading = signedIn && !isCurrent;
  const error = isCurrent ? state.error : null;

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();
    let active = true;

    fetchCart(controller.signal)
      .then((next) => {
        if (active) dispatch({ type: "loaded", cart: next, forUserId: userId });
      })
      .catch((err: unknown) => {
        if (!active || controller.signal.aborted) return;
        dispatch({
          type: "loadFailed",
          message: err instanceof Error ? err.message : "Couldn't load your cart",
          forUserId: userId,
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [userId, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  const quantityOf = useCallback(
    (productId: string) => cart.items.find((i) => i.productId === productId)?.quantity ?? 0,
    [cart.items]
  );

  const isPending = useCallback((productId: string) => pending[productId] === true, [pending]);

  const mark = useCallback((productId: string, value: boolean) => {
    setPending((prev) => ({ ...prev, [productId]: value }));
  }, []);

  /**
   * Applies the optimistic state, runs the request, and rolls back on failure.
   *
   * The stepper has to respond on the same frame as the tap — waiting for a
   * round trip makes it feel broken — so local state moves first and the server
   * is reconciled after.
   */
  const mutate = useCallback(
    async (productId: string, apply: (cart: Cart) => Cart, request: () => Promise<unknown>) => {
      dispatch({ type: "optimistic", apply });
      mark(productId, true);

      try {
        await request();
        dispatch({ type: "commit" });
      } catch (err) {
        dispatch({
          type: "rollback",
          message:
            err instanceof ApiError ? err.message : "Couldn't update your cart. Try again.",
        });
        throw err;
      } finally {
        mark(productId, false);
      }
    },
    [mark]
  );

  const add = useCallback(
    async (productId: string) => {
      const existing = cart.items.find((i) => i.productId === productId);

      // With no existing row there's nothing to render optimistically, so a
      // fresh add refetches to pick up the server's item. Only the increment
      // path is optimistic.
      if (!existing) {
        mark(productId, true);
        try {
          await addCartItem(productId, 1);
          const next = await fetchCart();
          if (userId) dispatch({ type: "loaded", cart: next, forUserId: userId });
        } catch (err) {
          dispatch({
            type: "rollback",
            message: err instanceof ApiError ? err.message : "Couldn't add to cart.",
          });
          throw err;
        } finally {
          mark(productId, false);
        }
        return;
      }

      const nextQuantity = existing.quantity + 1;
      await mutate(
        productId,
        (c) =>
          recompute(
            c.items.map((i) => (i.productId === productId ? { ...i, quantity: nextQuantity } : i))
          ),
        () => updateCartItem(productId, nextQuantity)
      );
    },
    [cart.items, mark, mutate, userId]
  );

  const setQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity < 1) {
        await mutate(
          productId,
          (c) => recompute(c.items.filter((i) => i.productId !== productId)),
          () => removeCartItem(productId)
        );
        return;
      }

      await mutate(
        productId,
        (c) => recompute(c.items.map((i) => (i.productId === productId ? { ...i, quantity } : i))),
        () => updateCartItem(productId, quantity)
      );
    },
    [mutate]
  );

  const remove = useCallback(
    async (productId: string) => {
      await mutate(
        productId,
        (c) => recompute(c.items.filter((i) => i.productId !== productId)),
        () => removeCartItem(productId)
      );
    },
    [mutate]
  );

  const clear = useCallback(async () => {
    dispatch({ type: "optimistic", apply: () => EMPTY_CART });
    try {
      await clearCartRequest();
      dispatch({ type: "commit" });
    } catch (err) {
      dispatch({
        type: "rollback",
        message: err instanceof ApiError ? err.message : "Couldn't clear your cart.",
      });
      throw err;
    }
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({ cart, loading, error, quantityOf, isPending, add, setQuantity, remove, clear, reload }),
    [cart, loading, error, quantityOf, isPending, add, setQuantity, remove, clear, reload]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
