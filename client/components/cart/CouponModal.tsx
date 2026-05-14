"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PercentCircleIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { validateCoupon, type CouponValidationResult } from "@/lib/coupon-api";
import { ApiError } from "@/lib/api";

interface CouponModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtotal: number;
  onApply: (coupon: { code: string; discountAmount: number }) => void;
}

export default function CouponModal({ open, onOpenChange, subtotal, onApply }: CouponModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validatedResult, setValidatedResult] = useState<CouponValidationResult | null>(null);

  function reset() {
    setCode("");
    setLoading(false);
    setError("");
    setValidatedResult(null);
  }

  function handleOpenChange(open: boolean) {
    if (!open) reset();
    onOpenChange(open);
  }

  async function handleValidate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setValidatedResult(null);

    try {
      const result = await validateCoupon(trimmed, subtotal);
      setValidatedResult(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to validate coupon");
    } finally {
      setLoading(false);
    }
  }

  function handleApply() {
    if (!validatedResult) return;
    onApply({
      code: validatedResult.coupon.code,
      discountAmount: validatedResult.discountAmount,
    });
    handleOpenChange(false);
  }

  function formatDiscountLabel(result: CouponValidationResult) {
    const { coupon, discountAmount } = result;
    const typeLabel =
      coupon.discountType === "PERCENTAGE"
        ? `${coupon.discountValue}% off`
        : `Flat \u20B9${coupon.discountValue.toLocaleString("en-IN")} off`;
    return `${coupon.code} \u2014 ${typeLabel} \u2014 You save \u20B9${discountAmount.toLocaleString("en-IN")}`;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-white/[0.08] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <HugeiconsIcon icon={PercentCircleIcon} size={20} className="text-[#49A5A2]" />
            Apply Coupon
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter your coupon code to get a discount on this order.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleValidate} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
                setValidatedResult(null);
              }}
              onBlur={() => setCode((c) => c.toUpperCase())}
              className="flex-1 h-10 px-3 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-gray-500 outline-none focus:border-[#49A5A2] transition-colors uppercase"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="h-10 px-4 bg-[#49A5A2] text-white text-sm font-semibold rounded-lg hover:bg-[#3d8e8b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              {loading ? "Checking..." : "Check"}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {validatedResult && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 space-y-3">
              <div className="flex items-start gap-2">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-300 font-medium">
                  {formatDiscountLabel(validatedResult)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleApply}
                className="w-full py-2.5 bg-[#49A5A2] text-white text-sm font-bold rounded-lg hover:bg-[#3d8e8b] transition-colors cursor-pointer"
              >
                Apply Coupon
              </button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
