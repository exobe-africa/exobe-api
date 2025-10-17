-- Create normalized pickup locations table
-- Allows multiple products to share pickup locations and easier management

CREATE TABLE IF NOT EXISTS "product_pickup_locations" (
  id           VARCHAR(25) PRIMARY KEY DEFAULT substr(replace(gen_random_uuid()::text,'-',''),1,25),
  vendor_id    VARCHAR(25) NOT NULL REFERENCES "vendors"(id) ON DELETE CASCADE,
  name         VARCHAR(100) NOT NULL,
  address      VARCHAR(255) NOT NULL,
  city         VARCHAR(100) NOT NULL,
  province     VARCHAR(100) NOT NULL,
  postal_code  VARCHAR(20) NOT NULL,
  country      VARCHAR(100) NOT NULL DEFAULT 'South Africa',
  instructions TEXT,
  is_default   BOOLEAN DEFAULT false,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMP(3) DEFAULT now(),
  updated_at   TIMESTAMP(3) DEFAULT now()
);

-- Add index for vendor lookups
CREATE INDEX IF NOT EXISTS "product_pickup_locations_vendor_id_idx" ON "product_pickup_locations"(vendor_id);

-- Add foreign key to catalog_products
ALTER TABLE "catalog_products" 
ADD COLUMN IF NOT EXISTS "pickup_location_id" VARCHAR(25) REFERENCES "product_pickup_locations"(id) ON DELETE SET NULL;

-- Add index for product pickup location lookups
CREATE INDEX IF NOT EXISTS "catalog_products_pickup_location_id_idx" ON "catalog_products"(pickup_location_id);

-- Add comments
COMMENT ON TABLE "product_pickup_locations" IS 'Normalized pickup locations for vendor products - allows reuse across multiple products';
COMMENT ON COLUMN "product_pickup_locations"."name" IS 'Location name (e.g., Main Warehouse, Store #1)';
COMMENT ON COLUMN "product_pickup_locations"."address" IS 'Physical street address where driver should collect products';
COMMENT ON COLUMN "product_pickup_locations"."instructions" IS 'Special instructions for drivers (e.g., gate code, contact person, loading dock location)';
COMMENT ON COLUMN "product_pickup_locations"."is_default" IS 'If true, this location is automatically selected for new products';
COMMENT ON COLUMN "product_pickup_locations"."is_active" IS 'If false, location is archived and cannot be used for new products';
COMMENT ON COLUMN "catalog_products"."pickup_location_id" IS 'Reference to pickup location where driver should collect this product';

