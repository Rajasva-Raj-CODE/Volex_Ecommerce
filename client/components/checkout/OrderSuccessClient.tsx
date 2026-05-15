"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, ShoppingBag01Icon } from "@hugeicons/core-free-icons";
import { getOrderById, type CustomerOrder } from "@/lib/orders-api";
import { ApiError } from "@/lib/api";

function formatPrice(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      return;
    }

    getOrderById(orderId)
      .then(setOrder)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Failed to load order");
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-sm">No order ID provided</p>
        <Link href="/" className="text-[#49A5A2] text-sm hover:underline">
          Go to Homepage
        </Link>
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

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-sm">{error || "Order not found"}</p>
        <Link href="/" className="text-[#49A5A2] text-sm hover:underline">
          Go to Homepage
        </Link>
      </div>
    );
  }

  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center animate-in zoom-in-50 duration-300">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={48} className="text-green-500" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-[14px] text-gray-500">
            Thank you for your order. We&apos;ll notify you once it&apos;s shipped.
          </p>
        </div>

        {/* Order details card */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 text-left space-y-3">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-gray-500">Order ID</span>
            <span className="font-mono font-semibold text-gray-900 text-[12px]">
              {order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <div className="flex items-center justify-between text-[13px]">
            <span className="text-gray-500">Items</span>
            <span className="font-semibold text-gray-900">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="flex items-center justify-between text-[13px]">
            <span className="text-gray-500">Total Amount</span>
            <span className="font-bold text-gray-900 text-[15px]">
              {formatPrice(Number(order.totalAmount))}
            </span>
          </div>

          <div className="flex items-center justify-between text-[13px]">
            <span className="text-gray-500">Payment</span>
            <span className="font-semibold text-gray-900">Cash on Delivery</span>
          </div>

          {order.address && (
            <>
              <div className="h-px bg-gray-100" />
              <div className="text-[13px]">
                <span className="text-gray-500">Delivering to</span>
                <p className="font-medium text-gray-900 mt-1">
                  {order.address.label && <span className="font-bold">{order.address.label} — </span>}
                  {order.address.line1}
                  {order.address.line2 ? `, ${order.address.line2}` : ""}
                  , {order.address.city}, {order.address.state} — {order.address.pincode}
                </p>
              </div>
            </>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/orders"
            className="flex-1 py-3 bg-[#49A5A2] text-white font-bold text-[14px] rounded-xl hover:bg-[#3d8e8b] transition-colors text-center"
          >
            View Orders
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold text-[14px] rounded-xl hover:bg-gray-50 transition-colors text-center flex items-center justify-center gap-2"
          >
            <HugeiconsIcon icon={ShoppingBag01Icon} size={16} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
