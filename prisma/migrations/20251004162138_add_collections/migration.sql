-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_products" (
    "id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "collection_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_collections" (
    "id" TEXT NOT NULL,
    "discount_id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,

    CONSTRAINT "discount_collections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collections_slug_key" ON "collections"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "collection_products_collection_id_product_id_key" ON "collection_products"("collection_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "discount_collections_discount_id_collection_id_key" ON "discount_collections"("discount_id", "collection_id");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_collections" ADD CONSTRAINT "discount_collections_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_collections" ADD CONSTRAINT "discount_collections_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
