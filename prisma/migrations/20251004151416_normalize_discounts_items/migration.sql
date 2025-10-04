-- CreateTable
CREATE TABLE "order_discount_items" (
    "id" TEXT NOT NULL,
    "order_discount_id" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_variant_id" TEXT NOT NULL,
    "amount_cents" INTEGER NOT NULL,

    CONSTRAINT "order_discount_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_discount_items" ADD CONSTRAINT "order_discount_items_order_discount_id_fkey" FOREIGN KEY ("order_discount_id") REFERENCES "order_discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_discount_items" ADD CONSTRAINT "order_discount_items_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
