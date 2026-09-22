import crypto from "node:crypto";
import https from "node:https";
import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import { AppError } from "../../middleware/error.middleware";
import { placeOrder } from "../orders/orders.service";
import { validateCoupon } from "../coupons/coupons.service";
import { createNotification } from "../notifications/notifications.service";
import type { CreateRazorpayOrderInput, VerifyRazorpayPaymentInput } from "./payments.schema";
import type { PlaceOrderInput } from "../orders/orders.schema";

async function calculateOrderTotal(userId: string, input: CreateRazorpayOrderInput) {
  const address = await prisma.address.findFirst({
    where: { id: input.addressId, userId },
  });
  if (!address) throw new AppError("Address not found", 404);

  let totalAmount = 0;

  for (const item of input.items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) throw new AppError(`Product ${item.productId} not found`, 404);
    if (!product.isActive) throw new AppError(`${product.name} is not available`, 400);
    if (product.stock < item.quantity) {
      throw new AppError(`Only ${product.stock} units of "${product.name}" in stock`, 400);
    }

    totalAmount += Number(product.price) * item.quantity;
  }

  // Apply coupon discount if provided
  if (input.couponCode) {
    const couponResult = await validateCoupon(input.couponCode, totalAmount);
    totalAmount = Math.max(0, totalAmount - couponResult.discountAmount);
  }

  return new Prisma.Decimal(totalAmount);
}

function razorpayRequest<T>(path: string, body: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const auth = Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString("base64");

    const req = https.request(
      {
        method: "POST",
        hostname: "api.razorpay.com",
        path,
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          const parsed = raw ? JSON.parse(raw) as T & { error?: { description?: string } } : undefined;

          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300 && parsed) {
            resolve(parsed);
            return;
          }

          reject(new AppError(parsed?.error?.description ?? "Razorpay request failed", res.statusCode ?? 500));
        });
      }
    );

    req.on("error", reject);
    req.end(payload);
  });
}

export async function createRazorpayOrder(userId: string, input: CreateRazorpayOrderInput) {
  const totalAmount = await calculateOrderTotal(userId, input);
  const amountInPaise = totalAmount.mul(100).toNumber();

  const razorpayOrder = await razorpayRequest<{
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  }>("/v1/orders", {
    amount: amountInPaise,
    currency: "INR",
    receipt: `voltex_${Date.now()}`,
    notes: {
      userId,
    },
  });

  // Persist the cart payload server-side. Without this the webhook has no way to
  // build the order when the browser never comes back to /verify.
  await prisma.paymentIntent.create({
    data: {
      razorpayOrderId: razorpayOrder.id,
      userId,
      addressId: input.addressId,
      items: input.items as unknown as Prisma.InputJsonValue,
      couponCode: input.couponCode,
      amount: totalAmount,
      currency: razorpayOrder.currency,
    },
  });

  return {
    keyId: env.RAZORPAY_KEY_ID,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  };
}

// ─── Shared completion path ───────────────────────────────────────────────────

/** Order shape stored on the intent, re-validated before use. */
function intentToOrderInput(intent: {
  addressId: string;
  items: Prisma.JsonValue;
  couponCode: string | null;
}): PlaceOrderInput {
  const items = Array.isArray(intent.items)
    ? (intent.items as { productId: string; quantity: number }[])
    : [];

  if (items.length === 0) {
    throw new AppError("Payment intent has no items", 422);
  }

  return {
    addressId: intent.addressId,
    items,
    couponCode: intent.couponCode ?? undefined,
  };
}

/**
 * Turns a successful payment into an order exactly once.
 *
 * Both the browser (`/verify`) and Razorpay (`/webhook`) call this, and Razorpay
 * retries failed deliveries, so every path has to be idempotent. Ordering:
 *
 *  1. An order already carrying this payment id → return it, nothing to do.
 *  2. Claim the intent with a conditional `updateMany` — only the caller that
 *     flips CREATED/FAILED → PROCESSING proceeds. The loser bails out.
 *  3. Place the order; on failure release the claim so a retry can pick it up.
 */
async function completePaymentIntent(args: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
  /** When set, the intent must belong to this user (browser-initiated call). */
  userId?: string;
  /** Fallback payload for intents created before this table existed. */
  fallback?: PlaceOrderInput & { userId: string };
}) {
  const existingOrder = await prisma.order.findUnique({
    where: { razorpayPaymentId: args.razorpayPaymentId },
  });
  if (existingOrder) return existingOrder;

  const intent = await prisma.paymentIntent.findUnique({
    where: { razorpayOrderId: args.razorpayOrderId },
  });

  // In-flight checkouts started before this deploy have no intent row. Fall back
  // to the client-supplied payload rather than dropping a real payment.
  if (!intent) {
    if (!args.fallback) {
      throw new AppError("Unknown payment order", 404);
    }
    return placeOrder(
      args.fallback.userId,
      { addressId: args.fallback.addressId, items: args.fallback.items, couponCode: args.fallback.couponCode },
      {
        paymentMethod: "RAZORPAY",
        paymentStatus: "PAID",
        razorpayOrderId: args.razorpayOrderId,
        razorpayPaymentId: args.razorpayPaymentId,
        razorpaySignature: args.razorpaySignature,
      }
    );
  }

  if (args.userId && intent.userId !== args.userId) {
    throw new AppError("Payment does not belong to this account", 403);
  }

  if (intent.status === "COMPLETED" && intent.orderId) {
    const order = await prisma.order.findUnique({ where: { id: intent.orderId } });
    if (order) return order;
  }

  const claim = await prisma.paymentIntent.updateMany({
    where: { razorpayOrderId: args.razorpayOrderId, status: { in: ["CREATED", "FAILED"] } },
    data: { status: "PROCESSING", razorpayPaymentId: args.razorpayPaymentId },
  });

  if (claim.count !== 1) {
    throw new AppError("This payment is already being processed", 409);
  }

  try {
    const order = await placeOrder(intent.userId, intentToOrderInput(intent), {
      paymentMethod: "RAZORPAY",
      paymentStatus: "PAID",
      razorpayOrderId: args.razorpayOrderId,
      razorpayPaymentId: args.razorpayPaymentId,
      razorpaySignature: args.razorpaySignature,
    });

    await prisma.paymentIntent.update({
      where: { razorpayOrderId: args.razorpayOrderId },
      data: { status: "COMPLETED", orderId: order.id, lastError: null },
    });

    return order;
  } catch (err) {
    // Release the claim so a webhook retry (or the other caller) can try again.
    await prisma.paymentIntent.update({
      where: { razorpayOrderId: args.razorpayOrderId },
      data: { status: "FAILED", lastError: err instanceof Error ? err.message : String(err) },
    });
    throw err;
  }
}

export async function verifyRazorpayPayment(userId: string, input: VerifyRazorpayPaymentInput) {
  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== input.razorpaySignature) {
    throw new AppError("Payment verification failed", 400);
  }

  return completePaymentIntent({
    razorpayOrderId: input.razorpayOrderId,
    razorpayPaymentId: input.razorpayPaymentId,
    razorpaySignature: input.razorpaySignature,
    userId,
    fallback: {
      userId,
      addressId: input.addressId,
      items: input.items,
      couponCode: input.couponCode,
    },
  });
}

// ─── Webhook ──────────────────────────────────────────────────────────────────

interface RazorpayWebhookEvent {
  event: string;
  payload?: {
    payment?: { entity?: { id?: string; order_id?: string; error_description?: string } };
    refund?: { entity?: { id?: string; payment_id?: string; amount?: number } };
    order?: { entity?: { id?: string } };
  };
}

/** Constant-time compare of two hex digests. */
function signaturesMatch(expected: string, received: string) {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function verifyWebhookSignature(rawBody: Buffer, signature: string | undefined) {
  if (!env.RAZORPAY_WEBHOOK_SECRET) {
    throw new AppError("Webhook secret is not configured", 503);
  }
  if (!signature) {
    throw new AppError("Missing webhook signature", 400);
  }

  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (!signaturesMatch(expected, signature)) {
    throw new AppError("Invalid webhook signature", 400);
  }
}

async function handlePaymentCaptured(paymentId: string, razorpayOrderId: string) {
  try {
    const order = await completePaymentIntent({ razorpayOrderId, razorpayPaymentId: paymentId });
    return { handled: true, orderId: order.id };
  } catch (err) {
    // A 409 means the browser is mid-verify — it will finish the job.
    if (err instanceof AppError && err.statusCode === 409) {
      return { handled: true, note: "already in progress" };
    }

    // Money was captured but we could not build the order (stock ran out, coupon
    // expired, …). Record it, tell the customer, and ack so Razorpay stops
    // retrying — this needs a human refund, not another delivery attempt.
    console.error(`Webhook: payment ${paymentId} captured but order failed:`, err);

    const intent = await prisma.paymentIntent.findUnique({ where: { razorpayOrderId } });
    if (intent) {
      try {
        await createNotification({
          userId: intent.userId,
          type: "SYSTEM",
          title: "Payment received — order needs attention",
          body: "We received your payment but could not complete the order. Our team will contact you about a refund shortly.",
          link: "/orders",
        });
      } catch (notifyErr) {
        console.error("Webhook: failed to notify customer of stuck payment:", notifyErr);
      }
    }

    return { handled: true, note: "captured but order failed — manual refund required" };
  }
}

async function handlePaymentFailed(paymentId: string, razorpayOrderId: string, reason?: string) {
  await prisma.paymentIntent.updateMany({
    where: { razorpayOrderId, status: { in: ["CREATED", "PROCESSING"] } },
    data: {
      status: "FAILED",
      razorpayPaymentId: paymentId,
      lastError: reason ?? "Payment failed at Razorpay",
    },
  });

  // If an order somehow exists for this payment, keep it in sync.
  await prisma.order.updateMany({
    where: { razorpayPaymentId: paymentId, paymentStatus: "PENDING" },
    data: { paymentStatus: "FAILED" },
  });

  return { handled: true };
}

async function handleRefundProcessed(paymentId: string) {
  const order = await prisma.order.findUnique({ where: { razorpayPaymentId: paymentId } });
  if (!order) return { handled: false, note: "no order for this payment" };
  if (order.paymentStatus === "REFUNDED") return { handled: true, note: "already refunded" };

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: "REFUNDED" },
  });

  try {
    await createNotification({
      userId: order.userId,
      type: "SYSTEM",
      title: "Refund processed",
      body: `Your refund for order #${order.id.slice(-8).toUpperCase()} has been processed. It should reach your account in 5-7 business days.`,
      link: `/orders/${order.id}`,
    });
  } catch (err) {
    console.error("Refund notification failed:", err);
  }

  return { handled: true, orderId: order.id };
}

/**
 * Dispatches a verified Razorpay webhook event.
 *
 * Callers should ack with 200 for anything this returns — a non-2xx makes
 * Razorpay redeliver, which only helps for genuinely transient failures.
 */
export async function handleWebhookEvent(event: RazorpayWebhookEvent) {
  const payment = event.payload?.payment?.entity;
  const refund = event.payload?.refund?.entity;

  switch (event.event) {
    case "payment.captured":
    case "order.paid": {
      const paymentId = payment?.id;
      const razorpayOrderId = payment?.order_id ?? event.payload?.order?.entity?.id;
      if (!paymentId || !razorpayOrderId) {
        return { handled: false, note: "missing payment or order id" };
      }
      return handlePaymentCaptured(paymentId, razorpayOrderId);
    }

    case "payment.failed": {
      if (!payment?.id || !payment.order_id) {
        return { handled: false, note: "missing payment or order id" };
      }
      return handlePaymentFailed(payment.id, payment.order_id, payment.error_description);
    }

    case "refund.processed":
    case "refund.created": {
      if (!refund?.payment_id) {
        return { handled: false, note: "missing payment id on refund" };
      }
      return handleRefundProcessed(refund.payment_id);
    }

    default:
      return { handled: false, note: `unhandled event: ${event.event}` };
  }
}
