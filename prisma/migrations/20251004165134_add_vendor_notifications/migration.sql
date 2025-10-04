-- CreateTable
CREATE TABLE "vendor_notification_settings" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "email_notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    "order_new" BOOLEAN NOT NULL DEFAULT true,
    "order_paid" BOOLEAN NOT NULL DEFAULT true,
    "order_cancelled" BOOLEAN NOT NULL DEFAULT true,
    "order_refunded" BOOLEAN NOT NULL DEFAULT true,
    "return_requested" BOOLEAN NOT NULL DEFAULT true,
    "low_stock" BOOLEAN NOT NULL DEFAULT true,
    "low_stock_threshold" INTEGER NOT NULL DEFAULT 5,
    "product_status_change" BOOLEAN NOT NULL DEFAULT true,
    "review_received" BOOLEAN NOT NULL DEFAULT true,
    "payout_sent" BOOLEAN NOT NULL DEFAULT true,
    "message_received" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_notification_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vendor_notification_settings_vendor_id_key" ON "vendor_notification_settings"("vendor_id");

-- AddForeignKey
ALTER TABLE "vendor_notification_settings" ADD CONSTRAINT "vendor_notification_settings_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
