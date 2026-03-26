"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PercentCircleIcon,
  ArrowRight01Icon,
  StarIcon,
  Delete02Icon,
  FavouriteIcon,
  MinusSignIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { MOCK_PRODUCT_DETAILS } from "@/lib/product-data";
import type { ProductDetail } from "@/lib/types";

interface CartItem {
  product: ProductDetail;
  quantity: number;
}

const INITIAL_CART: CartItem[] = [
  { product: MOCK_PRODUCT_DETAILS[4], quantity: 1 }, // Sony WH-1000XM5
  { product: MOCK_PRODUCT_DETAILS[7], quantity: 1 }, // JBL Flip 6
];

function formatPrice(price: number): string {
  return "₹" + price.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

function StarRating({ rating }: { rating: string }) {
  const numRating = parseFloat(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <HugeiconsIcon
          key={star}
          icon={StarIcon}
          size={14}
          className={
            star <= Math.round(numRating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }
          fill={star <= Math.round(numRating) ? "currentColor" : "none"}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">({numRating})</span>
    </div>
  );
}

export default function CartClient() {
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const totalOriginalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalDiscount = totalOriginalPrice - totalPrice;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
          <HugeiconsIcon icon={Delete02Icon} size={40} className="text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 text-sm">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <a
          href="/"
          className="mt-2 px-6 py-2.5 bg-[#49A5A2] text-white font-semibold rounded-lg hover:bg-[#3d8e8b] transition-colors"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: Cart Items */}
      <div className="flex-1 space-y-4">
        {/* Apply Coupon */}
        <button className="w-full flex items-center justify-between bg-white rounded-xl px-5 py-4 border border-gray-100 hover:border-gray-200 transition-colors group cursor-pointer">
          <div className="flex items-center gap-3">
            <HugeiconsIcon
              icon={PercentCircleIcon}
              size={22}
              className="text-gray-700"
            />
            <span className="text-[15px] font-bold text-gray-900">
              Apply Coupon
            </span>
          </div>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={20}
            className="text-gray-400 group-hover:text-gray-600 transition-colors"
          />
        </button>

        {/* Cart Items */}
        {cartItems.map((item) => (
          <div
            key={item.product.id}
            className="bg-white rounded-xl border border-gray-100 p-5"
          >
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Product Image */}
              <div className="flex-shrink-0 w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] mx-auto sm:mx-0 bg-gray-50 rounded-lg flex items-center justify-center p-3">
                <Image
                  src={item.product.images[0].src}
                  alt={item.product.images[0].alt}
                  width={130}
                  height={130}
                  className="object-contain max-h-full"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2">
                    {item.product.title}
                  </h3>
                  <StarRating rating={item.product.rating} />

                  <p className="text-[13px] text-gray-500">
                    Standard Delivery by{" "}
                    <span className="text-gray-700 font-medium">
                      {item.product.deliveryDate}
                    </span>{" "}
                    | {item.product.deliveryFee === "FREE" ? "FREE" : `₹${item.product.deliveryFee}`}
                  </p>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-xs text-gray-500 font-medium">Qty:</span>
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-l-lg transition-colors cursor-pointer"
                      >
                        <HugeiconsIcon icon={MinusSignIcon} size={14} className="text-gray-600" />
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-gray-800 border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-r-lg transition-colors cursor-pointer"
                      >
                        <HugeiconsIcon icon={PlusSignIcon} size={14} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                      <HugeiconsIcon icon={FavouriteIcon} size={15} />
                      Move to Wishlist
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={15} />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price Section */}
                <div className="flex flex-row sm:flex-col items-start sm:items-end gap-1 sm:min-w-[160px]">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(item.product.price)}
                  </span>
                  <span className="text-xs text-gray-500">(Incl. all Taxes)</span>
                  {item.product.originalPrice > item.product.price && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(item.product.originalPrice)}
                    </span>
                  )}
                  {item.product.emiStartsAt && (
                    <>
                      <div className="hidden sm:block w-full h-px bg-gray-200 my-1.5" />
                      <span className="text-sm font-bold text-gray-800">
                        {item.product.emiStartsAt}*
                      </span>
                      <button className="text-xs text-[#49A5A2] font-medium hover:underline cursor-pointer">
                        EMI Options
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
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
              <span className="text-gray-900 font-medium">
                {formatPrice(totalOriginalPrice)}
              </span>
            </div>

            {totalDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600 font-medium">
                  -{formatPrice(totalDiscount)}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Delivery</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>

            <div className="h-px bg-gray-200" />

            <div className="flex justify-between text-[15px]">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          <button className="w-full mt-5 py-3 bg-[#49A5A2] text-white font-bold text-[15px] rounded-xl hover:bg-[#3d8e8b] transition-colors cursor-pointer">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
