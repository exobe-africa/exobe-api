-- Add foreign key constraint for product relation in order_items table
-- This allows OrderItem to reference CatalogProduct directly

ALTER TABLE "order_items" 
ADD CONSTRAINT "order_items_product_id_fkey" 
FOREIGN KEY ("product_id") 
REFERENCES "catalog_products"("id") 
ON DELETE RESTRICT 
ON UPDATE CASCADE;

-- Add index for better query performance
CREATE INDEX "order_items_product_id_idx" ON "order_items"("product_id");
