"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PercentCircleIcon,
  ArrowRight01Icon,
  Delete02Icon,
  FavouriteIcon,
  MinusSignIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  type CartItem,
} from "@/lib/cart-api";
import { addToWishlist } from "@/lib/wishlist-api";
import { ApiError } from "@/lib/api";
import { notifyCartUpdated } from "@/lib/cart-events";
import CouponModal from "./CouponModal";

function formatPrice(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

export default function CartClient() {
  const { isLoggedIn, isReady, openLoginModal } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) { setLoading(false); return; }
    setLoading(true);
    setError("");
    try {
      const data = await getCart();
      setItems(data.items);
      setSubtotal(data.subtotal);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isReady) void fetchCart();
  }, [isReady, fetchCart]);

  const handleQuantityChange = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    setUpdatingId(item.productId);
    try {
      await updateCartItem(item.productId, newQty);
      setItems((prev) =>
        prev.map((i) => (i.productId === item.productId ? { ...i, quantity: newQty } : i))
      );
      setSubtotal((prev) => prev + Number(item.product.price) * delta);
      notifyCartUpdated();
    } catch {
      // Re-fetch on failure
      void fetchCart();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId: string) => {
    setUpdatingId(productId);
    try {
      await removeFromCart(productId);
      const removed = items.find((i) => i.productId === productId);
      if (removed) {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
        setSubtotal((prev) => prev - Number(removed.product.price) * removed.quantity);
        notifyCartUpdated();
      }
    } catch {
      void fetchCart();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMoveToWishlist = async (productId: string) => {
    try {
      await addToWishlist(productId);
      await handleRemove(productId);
    } catch {
      // silently fail if already in wishlist
      await handleRemove(productId);
    }
  };

  // Not ready yet
  if (!isReady) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-[#49A5A2] animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
          <HugeiconsIcon icon={FavouriteIcon} size={40} className="text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Sign in to view your cart</h2>
        <p className="text-gray-500 text-sm">Your cart items will be saved after you log in.</p>
        <button
          onClick={openLoginModal}
          className="mt-2 px-6 py-2.5 bg-[#49A5A2] text-white font-semibold rounded-lg hover:bg-[#3d8e8b] transition-colors"
        >
          Login / Sign Up
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-[#49A5A2] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={fetchCart} className="text-[#49A5A2] text-sm hover:underline">Try again</button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
          <HugeiconsIcon icon={Delete02Icon} size={40} className="text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 text-sm">Looks like you haven&apos;t added anything yet.</p>
        <Link
          href="/"
          className="mt-2 px-6 py-2.5 bg-[#49A5A2] text-white font-semibold rounded-lg hover:bg-[#3d8e8b] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const originalTotal = items.reduce(
    (sum, i) => sum + (Number(i.product.mrp) || Number(i.product.price)) * i.quantity,
    0
  );
  const discount = originalTotal - subtotal;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: Cart Items */}
      <div className="flex-1 space-y-4">
        {/* Apply Coupon */}
        <button
          onClick={() => setCouponModalOpen(true)}
          className="w-full flex items-center justify-between bg-white rounded-xl px-5 py-4 border border-gray-100 hover:border-gray-200 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={PercentCircleIcon} size={22} className="text-gray-700" />
            <span className="text-[15px] font-bold text-gray-900">Apply Coupon</span>
          </div>
          <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>

        {appliedCoupon && (
          <div className="flex items-center justify-between bg-emerald-50 rounded-xl px-5 py-3 border border-emerald-200">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={PercentCircleIcon} size={18} className="text-emerald-600" />
              <span className="text-[13px] font-semibold text-emerald-700">{appliedCoupon.code} applied</span>
              <span className="text-[12px] text-emerald-600">(-{formatPrice(appliedCoupon.discountAmount)})</span>
            </div>
            <button
              onClick={() => {
                setAppliedCoupon(null);
                sessionStorage.removeItem("voltex_coupon");
              }}
              className="text-[12px] font-semibold text-red-500 hover:text-red-600 hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}

        <CouponModal
          open={couponModalOpen}
          onOpenChange={setCouponModalOpen}
          subtotal={subtotal}
          onApply={(c) => {
            setAppliedCoupon(c);
            sessionStorage.setItem("voltex_coupon", JSON.stringify(c));
          }}
        />

        {items.map((item) => {
          const price = Number(item.product.price);
          const mrp = Number(item.product.mrp) || price;
          const image = item.product.images[0];
          const isUpdating = updatingId === item.productId;

          return (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Product Image */}
                <div className="flex-shrink-0 w-[140px] h-[140px] mx-auto sm:mx-0 bg-gray-50 rounded-lg flex items-center justify-center p-3">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt={item.product.name} className="object-contain max-h-full max-w-full" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded" />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Link href={`/product/${item.product.slug}`}>
                      <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-[#49A5A2] transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    {item.product.brand && (
                      <p className="text-xs text-gray-500 uppercase tracking-wide">{item.product.brand}</p>
                    )}

                    {/* Quantity */}
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-xs text-gray-500 font-medium">Qty:</span>
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={isUpdating || item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-l-lg transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <HugeiconsIcon icon={MinusSignIcon} size={14} className="text-gray-600" />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-gray-800 border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item, 1)}
                          disabled={isUpdating || item.quantity >= item.product.stock}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-r-lg transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <HugeiconsIcon icon={PlusSignIcon} size={14} className="text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleMoveToWishlist(item.productId)}
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-40"
                      >
                        <HugeiconsIcon icon={FavouriteIcon} size={15} />
                        Move to Wishlist
                      </button>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-40"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={15} />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex flex-row sm:flex-col items-start sm:items-end gap-1 sm:min-w-[160px]">
                    <span className="text-xl font-bold text-gray-900">{formatPrice(price * item.quantity)}</span>
                    <span className="text-xs text-gray-500">(Incl. all Taxes)</span>
                    {mrp > price && (
                      <span className="text-xs text-gray-400 line-through">{formatPrice(mrp * item.quantity)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: Order Summary */}
      <div className="lg:w-[340px] shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 p-5 lg:sticky lg:top-24">
          <h2 className="text-[17px] font-bold text-gray-900 mb-4">
            Order Summary ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h2>

          <div className="space-y-3 text-[14px]">
            <div className="flex justify-between">
              <span className="text-gray-600">Original Price</span>
              <span className="text-gray-900 font-medium">{formatPrice(originalTotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600 font-medium">-{formatPrice(discount)}</span>
              </div>
            )}

            {appliedCoupon && (
              <div className="flex justify-between">
                <span className="text-gray-600">Coupon ({appliedCoupon.code})</span>
                <span className="text-emerald-400 font-medium">-{formatPrice(appliedCoupon.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Delivery</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>

            <div className="h-px bg-gray-200" />

            <div className="flex justify-between text-[15px]">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">{formatPrice(subtotal - (appliedCoupon?.discountAmount ?? 0))}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full mt-5 py-3 bg-[#49A5A2] text-white font-bold text-[15px] rounded-xl hover:bg-[#3d8e8b] transition-colors cursor-pointer block text-center"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
