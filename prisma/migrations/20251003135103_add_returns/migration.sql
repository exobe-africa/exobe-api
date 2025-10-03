-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'IN_TRANSIT', 'RECEIVED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReturnMethod" AS ENUM ('PICKUP', 'DROPOFF');

-- CreateEnum
CREATE TYPE "RefundMethod" AS ENUM ('ORIGINAL', 'STORE_CREDIT');

-- CreateTable
CREATE TABLE "return_requests" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "status" "ReturnStatus" NOT NULL DEFAULT 'REQUESTED',
    "return_method" "ReturnMethod" NOT NULL DEFAULT 'PICKUP',
    "refund_method" "RefundMethod" NOT NULL DEFAULT 'ORIGINAL',
    "reason" TEXT,
    "total_refund_cents" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_items" (
    "id" TEXT NOT NULL,
    "return_request_id" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "reason" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "description" TEXT,
    "refund_cents" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_events" (
    "id" TEXT NOT NULL,
    "return_request_id" TEXT NOT NULL,
    "status" "ReturnStatus" NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "return_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_return_request_id_fkey" FOREIGN KEY ("return_request_id") REFERENCES "return_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_events" ADD CONSTRAINT "return_events_return_request_id_fkey" FOREIGN KEY ("return_request_id") REFERENCES "return_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
