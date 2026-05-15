import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  PackageIcon,
  DeliveryTruck01Icon,
  Tick02Icon,
  Cancel01Icon,
  Location01Icon,
  CreditCardIcon,
  UserIcon,
  ShoppingCart01Icon,
} from "@hugeicons/core-free-icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ApiOrder, OrderStatus } from "@/lib/orders-api";

const STATUS_STYLES: Record<OrderStatus, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  PENDING: { variant: "outline", className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50" },
  CONFIRMED: { variant: "secondary", className: "bg-blue-50 text-blue-700 hover:bg-blue-50" },
  SHIPPED: { variant: "default", className: "bg-purple-50 text-purple-700 hover:bg-purple-50" },
  DELIVERED: { variant: "outline", className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" },
  CANCELLED: { variant: "destructive", className: "bg-red-50 text-red-700 hover:bg-red-50" },
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_STEPS: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

const STEP_ICONS: Record<OrderStatus, typeof Tick02Icon> = {
  PENDING: Clock01Icon,
  CONFIRMED: PackageIcon,
  SHIPPED: DeliveryTruck01Icon,
  DELIVERED: Tick02Icon,
  CANCELLED: Cancel01Icon,
};

const PAYMENT_STATUS_COLOR: Record<string, string> = {
  PAID: "text-emerald-600",
  PENDING: "text-amber-600",
  FAILED: "text-red-600",
  REFUNDED: "text-blue-600",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(value: string | number) {
  return "₹" + Number(value).toLocaleString("en-IN");
}

interface OrderDetailSheetProps {
  order: ApiOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailSheet({ order, open, onOpenChange }: OrderDetailSheetProps) {
  if (!order) return null;

  const isCancelled = order.status === "CANCELLED";
  const currentStepIndex = STATUS_STEPS.indexOf(order.status);
  const subtotal = order.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between pr-8">
            <SheetTitle className="font-mono">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </SheetTitle>
            <Badge
              className={STATUS_STYLES[order.status]?.className || ""}
              variant={STATUS_STYLES[order.status]?.variant || "secondary"}
            >
              {STATUS_LABEL[order.status]}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-6">
          {/* Customer */}
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <HugeiconsIcon icon={UserIcon} size={14} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{order.user.name ?? "—"}</p>
              <p className="text-xs text-muted-foreground">{order.user.email}</p>
            </div>
          </div>

          {/* Status Timeline */}
          {!isCancelled && (
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                {STATUS_STEPS.map((step, i) => {
                  const isActive = i <= currentStepIndex;
                  const isLast = i === STATUS_STEPS.length - 1;
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isActive ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          <HugeiconsIcon icon={STEP_ICONS[step]} size={12} className={isActive ? "" : "text-muted-foreground"} />
                        </div>
                        <span className={`text-[10px] font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {STATUS_LABEL[step]}
                        </span>
                      </div>
                      {!isLast && (
                        <div className={`flex-1 h-[2px] mx-1.5 mb-5 ${i < currentStepIndex ? "bg-primary" : "bg-muted"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
              <p className="text-red-700 text-sm font-medium">This order has been cancelled</p>
            </div>
          )}

          <Separator />

          {/* Items */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg border bg-muted/30 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.product.images[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="object-contain w-full h-full p-1" />
                    ) : (
                      <HugeiconsIcon icon={ShoppingCart01Icon} size={16} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity} &times; {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums shrink-0">
                    {formatCurrency(Number(item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              {order.couponCode && order.discountAmount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coupon ({order.couponCode})</span>
                  <span className="text-emerald-600 tabular-nums">-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-emerald-600 font-medium">FREE</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Address */}
          {order.address && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <HugeiconsIcon icon={Location01Icon} size={14} className="text-primary" />
                <h3 className="text-sm font-semibold">Delivery Address</h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                <p className="text-foreground font-medium">{order.address.label}</p>
                <p>{order.address.line1}</p>
                {order.address.line2 && <p>{order.address.line2}</p>}
                <p>{order.address.city}, {order.address.state} — {order.address.pincode}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Payment Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HugeiconsIcon icon={CreditCardIcon} size={14} className="text-primary" />
              <h3 className="text-sm font-semibold">Payment</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">Method</p>
                <p className="font-medium">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">Status</p>
                <p className={`font-medium ${PAYMENT_STATUS_COLOR[order.paymentStatus] || ""}`}>
                  {order.paymentStatus}
                </p>
              </div>
              {order.razorpayPaymentId && (
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs mb-0.5">Payment ID</p>
                  <p className="font-mono text-xs text-muted-foreground">{order.razorpayPaymentId}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
