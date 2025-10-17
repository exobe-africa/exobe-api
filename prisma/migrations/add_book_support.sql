-- Add support for multiple product types with type-specific fields

-- Create ProductType enum with all supported types
CREATE TYPE "ProductType" AS ENUM (
  'GENERAL',
  'BOOK',
  'EBOOK',
  'ELECTRONICS',
  'CLOTHING',
  'FOOD',
  'BEVERAGE',
  'HEALTH',
  'BEAUTY',
  'SPORTS',
  'TOYS',
  'AUTOMOTIVE',
  'HOME',
  'GARDEN',
  'PET',
  'JEWELRY',
  'ART',
  'MUSIC',
  'SOFTWARE',
  'SERVICE'
);

-- Add product_type to catalog_products
ALTER TABLE "catalog_products" ADD COLUMN IF NOT EXISTS "product_type" "ProductType" DEFAULT 'GENERAL' NOT NULL;

-- Normalize into detail tables per type group

-- Core product-level identity fields (brand/model/material) remain on catalog_products
ALTER TABLE "catalog_products" ADD COLUMN IF NOT EXISTS "brand" VARCHAR(150);
ALTER TABLE "catalog_products" ADD COLUMN IF NOT EXISTS "model" VARCHAR(150);
ALTER TABLE "catalog_products" ADD COLUMN IF NOT EXISTS "material" VARCHAR(200);

-- Book details
CREATE TABLE IF NOT EXISTS "product_book_details" (
  id              VARCHAR(25) PRIMARY KEY DEFAULT substr(replace(gen_random_uuid()::text,'-',''),1,25),
  product_id      VARCHAR(25) UNIQUE REFERENCES "catalog_products"(id) ON DELETE CASCADE,
  isbn            VARCHAR(17),
  author          VARCHAR(200),
  publisher       VARCHAR(200),
  publication_date TIMESTAMP(3),
  pages           INTEGER,
  language        VARCHAR(50),
  genre           VARCHAR(100),
  format          VARCHAR(100),
  created_at      TIMESTAMP(3) DEFAULT now(),
  updated_at      TIMESTAMP(3) DEFAULT now()
);

-- Consumable details (food, beverage, health, pet, beauty)
CREATE TABLE IF NOT EXISTS "product_consumable_details" (
  id               VARCHAR(25) PRIMARY KEY DEFAULT substr(replace(gen_random_uuid()::text,'-',''),1,25),
  product_id       VARCHAR(25) UNIQUE REFERENCES "catalog_products"(id) ON DELETE CASCADE,
  expiry_date      TIMESTAMP(3),
  ingredients      JSONB,
  nutritional_info JSONB,
  created_at       TIMESTAMP(3) DEFAULT now(),
  updated_at       TIMESTAMP(3) DEFAULT now()
);

-- Electronics details
CREATE TABLE IF NOT EXISTS "product_electronics_details" (
  id               VARCHAR(25) PRIMARY KEY DEFAULT substr(replace(gen_random_uuid()::text,'-',''),1,25),
  product_id       VARCHAR(25) UNIQUE REFERENCES "catalog_products"(id) ON DELETE CASCADE,
  warranty_period  INTEGER,
  energy_rating    VARCHAR(10),
  created_at       TIMESTAMP(3) DEFAULT now(),
  updated_at       TIMESTAMP(3) DEFAULT now()
);

-- Media details
CREATE TABLE IF NOT EXISTS "product_media_details" (
  id          VARCHAR(25) PRIMARY KEY DEFAULT substr(replace(gen_random_uuid()::text,'-',''),1,25),
  product_id  VARCHAR(25) UNIQUE REFERENCES "catalog_products"(id) ON DELETE CASCADE,
  artist      VARCHAR(200),
  genre       VARCHAR(100),
  format      VARCHAR(100),
  release_at  TIMESTAMP(3),
  created_at  TIMESTAMP(3) DEFAULT now(),
  updated_at  TIMESTAMP(3) DEFAULT now()
);

-- Software details
CREATE TABLE IF NOT EXISTS "product_software_details" (
  id           VARCHAR(25) PRIMARY KEY DEFAULT substr(replace(gen_random_uuid()::text,'-',''),1,25),
  product_id   VARCHAR(25) UNIQUE REFERENCES "catalog_products"(id) ON DELETE CASCADE,
  platform     VARCHAR(100),
  license_type VARCHAR(100),
  created_at   TIMESTAMP(3) DEFAULT now(),
  updated_at   TIMESTAMP(3) DEFAULT now()
);

-- Service details
CREATE TABLE IF NOT EXISTS "product_service_details" (
  id               VARCHAR(25) PRIMARY KEY DEFAULT substr(replace(gen_random_uuid()::text,'-',''),1,25),
  product_id       VARCHAR(25) UNIQUE REFERENCES "catalog_products"(id) ON DELETE CASCADE,
  service_duration VARCHAR(100),
  created_at       TIMESTAMP(3) DEFAULT now(),
  updated_at       TIMESTAMP(3) DEFAULT now()
);

-- Compliance details
CREATE TABLE IF NOT EXISTS "product_compliance_details" (
  id            VARCHAR(25) PRIMARY KEY DEFAULT substr(replace(gen_random_uuid()::text,'-',''),1,25),
  product_id    VARCHAR(25) UNIQUE REFERENCES "catalog_products"(id) ON DELETE CASCADE,
  certification VARCHAR(200),
  age_rating    VARCHAR(20),
  created_at    TIMESTAMP(3) DEFAULT now(),
  updated_at    TIMESTAMP(3) DEFAULT now()
);

-- Make SKU optional in product_variants (for books using ISBN)
ALTER TABLE "product_variants" ALTER COLUMN "sku" DROP NOT NULL;

-- Add ISBN to product_variants
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "isbn" VARCHAR(17);

-- Drop existing unique constraint on SKU if it exists
ALTER TABLE "product_variants" DROP CONSTRAINT IF EXISTS "product_variants_sku_key";

-- Add unique constraints with NULL handling
CREATE UNIQUE INDEX IF NOT EXISTS "product_variants_sku_key" ON "product_variants"("sku") WHERE "sku" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "product_variants_isbn_key" ON "product_variants"("isbn") WHERE "isbn" IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN "catalog_products"."product_type" IS 'Type of product: GENERAL, BOOK, EBOOK, ELECTRONICS, CLOTHING, FOOD, BEVERAGE, HEALTH, BEAUTY, SPORTS, TOYS, AUTOMOTIVE, HOME, GARDEN, PET, JEWELRY, ART, MUSIC, SOFTWARE, SERVICE';
COMMENT ON COLUMN "catalog_products"."brand" IS 'Brand name (electronics, clothing, etc.)';
COMMENT ON COLUMN "catalog_products"."model" IS 'Model number/name (electronics, automotive)';
COMMENT ON COLUMN "catalog_products"."material" IS 'Material composition (clothing, jewelry, home)';
-- Comments for detail tables
COMMENT ON TABLE "product_book_details" IS 'Book-specific details (normalized)';
COMMENT ON TABLE "product_consumable_details" IS 'Consumable details (food, beverage, health, pet, beauty)';
COMMENT ON TABLE "product_electronics_details" IS 'Electronics details (warranty, energy rating)';
COMMENT ON TABLE "product_media_details" IS 'Media details (music, art)';
COMMENT ON TABLE "product_software_details" IS 'Software details (platform, license)';
COMMENT ON TABLE "product_service_details" IS 'Service details';
COMMENT ON TABLE "product_compliance_details" IS 'Compliance & safety details';
COMMENT ON COLUMN "product_variants"."isbn" IS 'ISBN-10 or ISBN-13 for book variants';

