/*
  Warnings:

  - You are about to drop the `user_notification_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."user_notification_settings" DROP CONSTRAINT "user_notification_settings_user_id_fkey";

-- DropTable
DROP TABLE "public"."user_notification_settings";

-- CreateTable
CREATE TABLE "customer_notification_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "order_confirmations" BOOLEAN NOT NULL DEFAULT true,
    "shipping_updates" BOOLEAN NOT NULL DEFAULT true,
    "delivery_notifications" BOOLEAN NOT NULL DEFAULT true,
    "product_recommendations" BOOLEAN NOT NULL DEFAULT false,
    "exclusive_deals" BOOLEAN NOT NULL DEFAULT false,
    "wishlist_updates" BOOLEAN NOT NULL DEFAULT false,
    "shopping_insights" BOOLEAN NOT NULL DEFAULT false,
    "login_alerts" BOOLEAN NOT NULL DEFAULT true,
    "password_changes" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_notification_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_notification_settings_user_id_key" ON "customer_notification_settings"("user_id");

-- AddForeignKey
ALTER TABLE "customer_notification_settings" ADD CONSTRAINT "customer_notification_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
