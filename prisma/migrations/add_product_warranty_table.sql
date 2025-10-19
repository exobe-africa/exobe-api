-- CreateTable
CREATE TABLE "product_warranties" (
    "id" VARCHAR(25) NOT NULL,
    "vendor_id" VARCHAR(25) NOT NULL,
    "name" VARCHAR(100),
    "has_warranty" BOOLEAN NOT NULL DEFAULT false,
    "warranty_period" INTEGER,
    "warranty_unit" VARCHAR(10),
    "warranty_details" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_warranties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_warranties_vendor_id_idx" ON "product_warranties"("vendor_id");

-- AddColumn to catalog_products
ALTER TABLE "catalog_products" ADD COLUMN "warranty_id" VARCHAR(25);

-- CreateIndex on catalog_products
CREATE INDEX "catalog_products_warranty_id_idx" ON "catalog_products"("warranty_id");

-- AddForeignKey to catalog_products
ALTER TABLE "catalog_products" ADD CONSTRAINT "catalog_products_warranty_id_fkey" FOREIGN KEY ("warranty_id") REFERENCES "product_warranties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey to product_warranties
ALTER TABLE "product_warranties" ADD CONSTRAINT "product_warranties_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Remove warranty_period from product_electronics_details if it exists
ALTER TABLE "product_electronics_details" DROP COLUMN IF EXISTS "warranty_period";

