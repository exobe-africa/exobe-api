-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PRODUCT_AMOUNT', 'PRODUCT_PERCENT', 'BUY_X_GET_Y', 'ORDER_AMOUNT', 'ORDER_PERCENT', 'FREE_SHIPPING');

-- CreateEnum
CREATE TYPE "DiscountMethod" AS ENUM ('CODE', 'AUTOMATIC');

-- CreateEnum
CREATE TYPE "GiftCardStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "GiftCardTransactionType" AS ENUM ('ISSUE', 'REDEEM', 'REFUND', 'ADJUSTMENT');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "gift_card_amount_cents" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gift_card_code" TEXT;

-- CreateTable
CREATE TABLE "discounts" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "title" TEXT,
    "description" TEXT,
    "type" "DiscountType" NOT NULL,
    "method" "DiscountMethod" NOT NULL DEFAULT 'CODE',
    "vendor_id" TEXT,
    "created_by_user_id" TEXT,
    "amount_cents" INTEGER,
    "percent" INTEGER,
    "buy_x_quantity" INTEGER,
    "get_y_quantity" INTEGER,
    "min_purchase_amount_cents" INTEGER,
    "min_quantity" INTEGER,
    "usage_limit_total" INTEGER,
    "usage_limit_per_customer" INTEGER,
    "applies_to_all_products" BOOLEAN NOT NULL DEFAULT false,
    "combine_with_product" BOOLEAN NOT NULL DEFAULT true,
    "combine_with_order" BOOLEAN NOT NULL DEFAULT false,
    "combine_with_shipping" BOOLEAN NOT NULL DEFAULT false,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "shipping_countries" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_products" (
    "id" TEXT NOT NULL,
    "discount_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "discount_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_categories" (
    "id" TEXT NOT NULL,
    "discount_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "discount_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_redemptions" (
    "id" TEXT NOT NULL,
    "discount_id" TEXT NOT NULL,
    "order_id" TEXT,
    "customer_id" TEXT,
    "amount_cents" INTEGER NOT NULL DEFAULT 0,
    "code_used" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discount_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_discounts" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "discount_id" TEXT,
    "code" TEXT,
    "amount_cents" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "order_discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_cards" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "customer_id" TEXT,
    "initial_value_cents" INTEGER NOT NULL,
    "balance_cents" INTEGER NOT NULL,
    "status" "GiftCardStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gift_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_card_transactions" (
    "id" TEXT NOT NULL,
    "gift_card_id" TEXT NOT NULL,
    "type" "GiftCardTransactionType" NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "notes" TEXT,
    "order_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gift_card_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "discounts_code_key" ON "discounts"("code");

-- CreateIndex
CREATE UNIQUE INDEX "discount_products_discount_id_product_id_key" ON "discount_products"("discount_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "discount_categories_discount_id_category_id_key" ON "discount_categories"("discount_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "gift_cards_code_key" ON "gift_cards"("code");

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_products" ADD CONSTRAINT "discount_products_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_categories" ADD CONSTRAINT "discount_categories_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_redemptions" ADD CONSTRAINT "discount_redemptions_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_redemptions" ADD CONSTRAINT "discount_redemptions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_discounts" ADD CONSTRAINT "order_discounts_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_discounts" ADD CONSTRAINT "order_discounts_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_card_transactions" ADD CONSTRAINT "gift_card_transactions_gift_card_id_fkey" FOREIGN KEY ("gift_card_id") REFERENCES "gift_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_card_transactions" ADD CONSTRAINT "gift_card_transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
