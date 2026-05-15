-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
ADD COLUMN "razorpayOrderId" TEXT,
ADD COLUMN "razorpayPaymentId" TEXT,
ADD COLUMN "razorpaySignature" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_razorpayPaymentId_key" ON "Order"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus");

-- CreateIndex
CREATE INDEX "Order_razorpayOrderId_idx" ON "Order"("razorpayOrderId");
