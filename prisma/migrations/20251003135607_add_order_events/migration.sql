-- CreateTable
CREATE TABLE "order_events" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "status" "OrderStatus",
    "payment_status" "PaymentStatus",
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_events" ADD CONSTRAINT "order_events_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
