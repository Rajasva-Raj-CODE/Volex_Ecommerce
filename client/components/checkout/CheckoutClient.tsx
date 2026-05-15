"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Add01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "@/contexts/AuthContext";
import { getCart, type CartResponse } from "@/lib/cart-api";
import {
  getAddresses,
  createAddress,
  type ApiAddress,
  type CreateAddressInput,
} from "@/lib/address-api";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/payments-api";
import { validateCoupon } from "@/lib/coupon-api";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

function formatPrice(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

export default function CheckoutClient() {
  const router = useRouter();
  const { isLoggedIn, isReady } = useAuth();

  // Data
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<CreateAddressInput>({
    label: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [savingAddress, setSavingAddress] = useState(false);

  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Order
  const [placing, setPlacing] = useState(false);

  function loadRazorpayScript() {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  const fetchData = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    setError("");
    try {
      const [cartData, addressData] = await Promise.all([getCart(), getAddresses()]);
      setCart(cartData);
      setAddresses(addressData);

      if (cartData.items.length === 0) {
        router.push("/cart");
        return;
      }

      // Pre-select default address or first
      const defaultAddr = addressData.find((a) => a.isDefault) ?? addressData[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else {
        setShowAddressForm(true);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load checkout data");
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (isReady) void fetchData();
  }, [isReady, fetchData]);

  // Read coupon from sessionStorage (set by CartClient)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("voltex_coupon");
      if (stored) {
        const parsed = JSON.parse(stored) as { code: string; discountAmount: number };
        if (parsed.code && typeof parsed.discountAmount === "number") {
          setAppliedCoupon(parsed);
        }
      }
    } catch {
      // ignore invalid data
    }
  }, []);

  const handleSaveAddress = async () => {
    if (!addressForm.line1 || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast.error("Please fill in all required address fields");
      return;
    }
    setSavingAddress(true);
    try {
      const newAddr = await createAddress({
        ...addressForm,
        isDefault: addresses.length === 0,
      });
      setAddresses((prev) => [...prev, newAddr]);
      setSelectedAddressId(newAddr.id);
      setShowAddressForm(false);
      setAddressForm({ label: "", line1: "", line2: "", city: "", state: "", pincode: "" });
      toast.success("Address saved");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code || !cart) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const result = await validateCoupon(code, cart.subtotal);
      const coupon = { code: result.coupon.code, discountAmount: result.discountAmount };
      setAppliedCoupon(coupon);
      sessionStorage.setItem("voltex_coupon", JSON.stringify(coupon));
      setCouponCode("");
      toast.success(`Coupon ${coupon.code} applied!`);
    } catch (err) {
      setCouponError(err instanceof ApiError ? err.message : "Invalid coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    sessionStorage.removeItem("voltex_coupon");
    setCouponCode("");
    setCouponError("");
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !cart || cart.items.length === 0) return;
    setPlacing(true);
    setError("");
    try {
      const orderInput = {
        addressId: selectedAddressId,
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        ...(appliedCoupon?.code ? { couponCode: appliedCoupon.code } : {}),
      };

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Unable to load Razorpay checkout");
      }

      const paymentOrder = await createRazorpayOrder(orderInput);

      const checkout = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "VolteX",
        description: "Order payment",
        order_id: paymentOrder.orderId,
        handler: (response) => {
          void (async () => {
            try {
              const order = await verifyRazorpayPayment({
                ...orderInput,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              sessionStorage.removeItem("voltex_coupon");
              router.push(`/checkout/success?orderId=${order.id}`);
            } catch (err) {
              const msg = err instanceof ApiError ? err.message : "Payment verified, but order creation failed";
              setError(msg);
              toast.error(msg);
              setPlacing(false);
            }
          })();
        },
        theme: {
          color: "#49A5A2",
        },
        modal: {
          ondismiss: () => setPlacing(false),
        },
      });

      checkout.open();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to place order";
      setError(msg);
      toast.error(msg);
      setPlacing(false);
    }
  };

  if (!isReady || loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-[#49A5A2] animate-spin" />
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={fetchData} className="text-[#49A5A2] text-sm hover:underline">
          Try again
        </button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) return null;

  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const originalTotal = cart.items.reduce(
    (sum, i) => sum + (Number(i.product.mrp) || Number(i.product.price)) * i.quantity,
    0
  );
  const discount = originalTotal - cart.subtotal;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left column */}
      <div className="flex-1 space-y-5">
        {/* ── Delivery Address ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Location01Icon} size={20} className="text-[#49A5A2]" />
              <h2 className="text-[17px] font-bold text-gray-900">Delivery Address</h2>
            </div>
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-[#49A5A2] hover:underline cursor-pointer"
              >
                <HugeiconsIcon icon={Add01Icon} size={16} />
                Add New
              </button>
            )}
          </div>

          {/* Address list */}
          {addresses.length > 0 && (
            <div className="space-y-3 mb-4">
              {addresses.map((addr) => {
                const selected = selectedAddressId === addr.id;
                return (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      selected
                        ? "border-[#49A5A2] bg-[#49A5A2]/5"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          selected ? "border-[#49A5A2]" : "border-gray-300"
                        }`}
                      >
                        {selected && <div className="w-2 h-2 rounded-full bg-[#49A5A2]" />}
                      </div>
                      <span className="text-[14px] font-bold text-gray-900">
                        {addr.label || "Address"}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[11px] font-semibold text-[#49A5A2] bg-[#49A5A2]/10 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-gray-600 ml-6">
                      {addr.line1}
                      {addr.line2 ? `, ${addr.line2}` : ""}
                      , {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Inline address form */}
          {showAddressForm && (
            <div className="border border-gray-100 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-bold text-gray-900">New Address</h3>
                {addresses.length > 0 && (
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={18} />
                  </button>
                )}
              </div>
              <input
                placeholder="Label (e.g. Home, Office)"
                value={addressForm.label}
                onChange={(e) => setAddressForm((f) => ({ ...f, label: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#49A5A2]"
              />
              <input
                placeholder="Address Line 1 *"
                value={addressForm.line1}
                onChange={(e) => setAddressForm((f) => ({ ...f, line1: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#49A5A2]"
              />
              <input
                placeholder="Address Line 2"
                value={addressForm.line2}
                onChange={(e) => setAddressForm((f) => ({ ...f, line2: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#49A5A2]"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="City *"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))}
                  className="h-10 px-3 rounded-lg border border-gray-200 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#49A5A2]"
                />
                <input
                  placeholder="State *"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm((f) => ({ ...f, state: e.target.value }))}
                  className="h-10 px-3 rounded-lg border border-gray-200 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#49A5A2]"
                />
              </div>
              <input
                placeholder="Pincode *"
                value={addressForm.pincode}
                onChange={(e) => setAddressForm((f) => ({ ...f, pincode: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#49A5A2]"
              />
              <button
                onClick={handleSaveAddress}
                disabled={savingAddress}
                className="w-full py-2.5 bg-[#49A5A2] text-white font-semibold text-[13px] rounded-lg hover:bg-[#3d8e8b] transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingAddress ? "Saving..." : "Save Address"}
              </button>
            </div>
          )}

          {addresses.length === 0 && !showAddressForm && (
            <p className="text-[13px] text-gray-400">No saved addresses. Add one to continue.</p>
          )}
        </div>

        {/* ── Coupon Code ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-[17px] font-bold text-gray-900 mb-4">Coupon Code</h2>

          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div>
                <span className="text-[13px] font-bold text-emerald-700">{appliedCoupon.code}</span>
                <p className="text-[12px] text-emerald-600 mt-0.5">
                  You save {formatPrice(appliedCoupon.discountAmount)}
                </p>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-[12px] font-semibold text-red-500 hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#49A5A2] uppercase"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim() || couponLoading}
                  className="px-4 h-10 bg-[#49A5A2] text-white font-semibold text-[13px] rounded-lg hover:bg-[#3d8e8b] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>
              {couponError && (
                <p className="text-red-500 text-[12px] mt-2">{couponError}</p>
              )}
            </div>
          )}
        </div>

        {/* ── Payment Method ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-[17px] font-bold text-gray-900 mb-4">Payment Method</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-[#49A5A2] bg-[#49A5A2]/5">
              <div className="w-4 h-4 rounded-full border-2 border-[#49A5A2] flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#49A5A2]" />
              </div>
              <div className="flex-1">
                <span className="text-[14px] font-bold text-gray-900">Razorpay Test Payment</span>
                <p className="text-[12px] text-gray-500 mt-0.5">Cards, UPI, net banking, and wallets in Razorpay checkout</p>
              </div>
            </div>
          </div>

          <p className="text-[12px] text-gray-400 mt-3">
            Test mode is enabled. No real money is charged.
          </p>
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="lg:w-[340px] shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 p-5 lg:sticky lg:top-24">
          <h2 className="text-[17px] font-bold text-gray-900 mb-4">
            Order Summary ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h2>

          {/* Compact item list */}
          <div className="space-y-3 mb-4 max-h-[240px] overflow-y-auto">
            {cart.items.map((item) => {
              const price = Number(item.product.price);
              const image = item.product.images[0];
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 shrink-0 flex items-center justify-center overflow-hidden">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt={item.product.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-[12px] text-gray-500">
                      Qty: {item.quantity} &times; {formatPrice(price)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-px bg-gray-200 mb-3" />

          {/* Price breakdown */}
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
              <span className="font-bold text-gray-900">{formatPrice(cart.subtotal - (appliedCoupon?.discountAmount ?? 0))}</span>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-[12px] mt-3">{error}</p>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={!selectedAddressId || placing}
            className="w-full mt-5 py-3 bg-[#49A5A2] text-white font-bold text-[15px] rounded-xl hover:bg-[#3d8e8b] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {placing ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Opening Payment...
              </>
            ) : (
              <>
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                Place Order
              </>
            )}
          </button>

          <Link
            href="/cart"
            className="block text-center text-[13px] text-[#49A5A2] hover:underline mt-3"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
