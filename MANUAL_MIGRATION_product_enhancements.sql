-- ==========================================
-- Manual Migration: Product Enhancements
-- ==========================================
-- This migration adds:
-- 1. Shipping fields (delivery timeframe, weight, dimensions)
-- 2. Product types enum and type-specific detail tables
-- 3. Pickup location normalization
-- 4. Return policy normalization
-- 5. Tags support
-- ==========================================

-- Step 1: Add ProductType enum
DO $$ BEGIN
  CREATE TYPE "ProductType" AS ENUM (
    'GENERAL', 'BOOK', 'EBOOK', 'ELECTRONICS', 'CLOTHING', 'FOOD', 
    'BEVERAGE', 'HEALTH', 'BEAUTY', 'SPORTS', 'TOYS', 'AUTOMOTIVE', 
    'HOME', 'GARDEN', 'PET', 'JEWELRY', 'ART', 'MUSIC', 'SOFTWARE', 'SERVICE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 2: Add shipping and product type fields to catalog_products
ALTER TABLE "catalog_products"
  ADD COLUMN IF NOT EXISTS "delivery_min_days" INTEGER,
  ADD COLUMN IF NOT EXISTS "delivery_max_days" INTEGER,
  ADD COLUMN IF NOT EXISTS "weight" DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS "weight_unit" VARCHAR(10),
  ADD COLUMN IF NOT EXISTS "length" DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS "width" DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS "height" DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS "dimension_unit" VARCHAR(10),
  ADD COLUMN IF NOT EXISTS "product_type" "ProductType" NOT NULL DEFAULT 'GENERAL',
  ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Step 3: Create product_pickup_locations table
CREATE TABLE IF NOT EXISTS "product_pickup_locations" (
  "id" VARCHAR(25) NOT NULL,
  "vendor_id" VARCHAR(25) NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "address" VARCHAR(255) NOT NULL,
  "city" VARCHAR(100) NOT NULL,
  "province" VARCHAR(100) NOT NULL,
  "postal_code" VARCHAR(20) NOT NULL,
  "country" VARCHAR(100) NOT NULL,
  "instructions" TEXT,
  "is_default" BOOLEAN NOT NULL DEFAULT false,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "product_pickup_locations_pkey" PRIMARY KEY ("id")
);

-- Step 4: Create product_return_policies table
CREATE TABLE IF NOT EXISTS "product_return_policies" (
  "id" VARCHAR(25) NOT NULL,
  "vendor_id" VARCHAR(25) NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "returns_accepted" BOOLEAN NOT NULL DEFAULT true,
  "return_period_days" INTEGER,
  "return_conditions" TEXT,
  "restocking_fee_pct" DECIMAL(5,2),
  "return_shipping_paid_by" VARCHAR(20),
  "is_default" BOOLEAN NOT NULL DEFAULT false,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "product_return_policies_pkey" PRIMARY KEY ("id")
);

-- Step 5: Add foreign keys to catalog_products
ALTER TABLE "catalog_products"
  ADD COLUMN IF NOT EXISTS "pickup_location_id" VARCHAR(25),
  ADD COLUMN IF NOT EXISTS "return_policy_id" VARCHAR(25);

-- Step 6: Create type-specific detail tables

-- Book Details
CREATE TABLE IF NOT EXISTS "product_book_details" (
  "id" VARCHAR(25) NOT NULL,
  "product_id" VARCHAR(25) NOT NULL,
  "isbn" VARCHAR(20),
  "author" VARCHAR(255),
  "publisher" VARCHAR(255),
  "publication_date" TIMESTAMP(3),
  "pages" INTEGER,
  "language" VARCHAR(50),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "product_book_details_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "product_book_details_product_id_key" UNIQUE ("product_id")
);

-- Consumable Details (Food/Beverage/Health)
CREATE TABLE IF NOT EXISTS "product_consumable_details" (
  "id" VARCHAR(25) NOT NULL,
  "product_id" VARCHAR(25) NOT NULL,
  "expiry_date" TIMESTAMP(3),
  "ingredients" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "product_consumable_details_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "product_consumable_details_product_id_key" UNIQUE ("product_id")
);

-- Electronics Details
CREATE TABLE IF NOT EXISTS "product_electronics_details" (
  "id" VARCHAR(25) NOT NULL,
  "product_id" VARCHAR(25) NOT NULL,
  "brand" VARCHAR(100),
  "model" VARCHAR(100),
  "warranty_period" INTEGER,
  "energy_rating" VARCHAR(10),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "product_electronics_details_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "product_electronics_details_product_id_key" UNIQUE ("product_id")
);

-- Media Details (Music/Art/Ebook)
CREATE TABLE IF NOT EXISTS "product_media_details" (
  "id" VARCHAR(25) NOT NULL,
  "product_id" VARCHAR(25) NOT NULL,
  "artist" VARCHAR(255),
  "genre" VARCHAR(100),
  "format" VARCHAR(50),
  "age_rating" VARCHAR(10),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "product_media_details_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "product_media_details_product_id_key" UNIQUE ("product_id")
);

-- Software Details
CREATE TABLE IF NOT EXISTS "product_software_details" (
  "id" VARCHAR(25) NOT NULL,
  "product_id" VARCHAR(25) NOT NULL,
  "platform" VARCHAR(100),
  "license_type" VARCHAR(50),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "product_software_details_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "product_software_details_product_id_key" UNIQUE ("product_id")
);

-- Service Details
CREATE TABLE IF NOT EXISTS "product_service_details" (
  "id" VARCHAR(25) NOT NULL,
  "product_id" VARCHAR(25) NOT NULL,
  "service_duration" INTEGER,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "product_service_details_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "product_service_details_product_id_key" UNIQUE ("product_id")
);

-- Compliance Details (Clothing/Toys/etc with care/material info)
CREATE TABLE IF NOT EXISTS "product_compliance_details" (
  "id" VARCHAR(25) NOT NULL,
  "product_id" VARCHAR(25) NOT NULL,
  "material" VARCHAR(255),
  "care_instructions" TEXT,
  "certification" VARCHAR(100),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "product_compliance_details_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "product_compliance_details_product_id_key" UNIQUE ("product_id")
);

-- Step 7: Add indexes
CREATE INDEX IF NOT EXISTS "product_pickup_locations_vendor_id_idx" ON "product_pickup_locations"("vendor_id");
CREATE INDEX IF NOT EXISTS "product_return_policies_vendor_id_idx" ON "product_return_policies"("vendor_id");
CREATE INDEX IF NOT EXISTS "product_book_details_product_id_idx" ON "product_book_details"("product_id");
CREATE INDEX IF NOT EXISTS "product_consumable_details_product_id_idx" ON "product_consumable_details"("product_id");
CREATE INDEX IF NOT EXISTS "product_electronics_details_product_id_idx" ON "product_electronics_details"("product_id");
CREATE INDEX IF NOT EXISTS "product_media_details_product_id_idx" ON "product_media_details"("product_id");
CREATE INDEX IF NOT EXISTS "product_software_details_product_id_idx" ON "product_software_details"("product_id");
CREATE INDEX IF NOT EXISTS "product_service_details_product_id_idx" ON "product_service_details"("product_id");
CREATE INDEX IF NOT EXISTS "product_compliance_details_product_id_idx" ON "product_compliance_details"("product_id");

-- Step 8: Add foreign key constraints
DO $$ BEGIN
  ALTER TABLE "product_pickup_locations" 
    ADD CONSTRAINT "product_pickup_locations_vendor_id_fkey" 
    FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "product_return_policies" 
    ADD CONSTRAINT "product_return_policies_vendor_id_fkey" 
    FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "catalog_products" 
    ADD CONSTRAINT "catalog_products_pickup_location_id_fkey" 
    FOREIGN KEY ("pickup_location_id") REFERENCES "product_pickup_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "catalog_products" 
    ADD CONSTRAINT "catalog_products_return_policy_id_fkey" 
    FOREIGN KEY ("return_policy_id") REFERENCES "product_return_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "product_book_details" 
    ADD CONSTRAINT "product_book_details_product_id_fkey" 
    FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "product_consumable_details" 
    ADD CONSTRAINT "product_consumable_details_product_id_fkey" 
    FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "product_electronics_details" 
    ADD CONSTRAINT "product_electronics_details_product_id_fkey" 
    FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "product_media_details" 
    ADD CONSTRAINT "product_media_details_product_id_fkey" 
    FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "product_software_details" 
    ADD CONSTRAINT "product_software_details_product_id_fkey" 
    FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "product_service_details" 
    ADD CONSTRAINT "product_service_details_product_id_fkey" 
    FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "product_compliance_details" 
    ADD CONSTRAINT "product_compliance_details_product_id_fkey" 
    FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 9: Add comments for documentation
COMMENT ON TABLE "product_pickup_locations" IS 'Physical locations where products can be collected by drivers';
COMMENT ON TABLE "product_return_policies" IS 'Reusable return policy configurations for products';
COMMENT ON TABLE "product_book_details" IS 'Additional details specific to book products';
COMMENT ON TABLE "product_consumable_details" IS 'Additional details for consumable products (food, beverage, health)';
COMMENT ON TABLE "product_electronics_details" IS 'Additional details specific to electronic products';
COMMENT ON TABLE "product_media_details" IS 'Additional details for media products (music, art, ebooks)';
COMMENT ON TABLE "product_software_details" IS 'Additional details specific to software products';
COMMENT ON TABLE "product_service_details" IS 'Additional details specific to service products';
COMMENT ON TABLE "product_compliance_details" IS 'Compliance and material info for clothing, toys, etc';

-- ==========================================
-- END OF MIGRATION
-- ==========================================

