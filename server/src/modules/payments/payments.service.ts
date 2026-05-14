import crypto from "node:crypto";
import https from "node:https";
import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import { AppError } from "../../middleware/error.middleware";
import { placeOrder } from "../orders/orders.service";
import type { CreateRazorpayOrderInput, VerifyRazorpayPaymentInput } from "./payments.schema";

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

  return {
    keyId: env.RAZORPAY_KEY_ID,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  };
}

export async function verifyRazorpayPayment(userId: string, input: VerifyRazorpayPaymentInput) {
  const existingOrder = await prisma.order.findUnique({
    where: { razorpayPaymentId: input.razorpayPaymentId },
  });

  if (existingOrder) {
    throw new AppError("This payment has already been used for an order", 409);
  }

  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== input.razorpaySignature) {
    throw new AppError("Payment verification failed", 400);
  }

  return placeOrder(userId, {
    addressId: input.addressId,
    items: input.items,
  }, {
    paymentMethod: "RAZORPAY",
    paymentStatus: "PAID",
    razorpayOrderId: input.razorpayOrderId,
    razorpayPaymentId: input.razorpayPaymentId,
    razorpaySignature: input.razorpaySignature,
  });
}
