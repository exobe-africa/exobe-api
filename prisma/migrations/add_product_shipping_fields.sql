-- Add new fields to catalog_products table for delivery, weight, and dimensions

-- Add delivery timeframe fields
ALTER TABLE "catalog_products" ADD COLUMN IF NOT EXISTS "delivery_min_days" INTEGER;
ALTER TABLE "catalog_products" ADD COLUMN IF NOT EXISTS "delivery_max_days" INTEGER;

-- Add weight fields
ALTER TABLE "catalog_products" ADD COLUMN IF NOT EXISTS "weight" DOUBLE PRECISION;
ALTER TABLE "catalog_products" ADD COLUMN IF NOT EXISTS "weight_unit" VARCHAR(10);

-- Add dimension fields
ALTER TABLE "catalog_products" ADD COLUMN IF NOT EXISTS "length" DOUBLE PRECISION;
ALTER TABLE "catalog_products" ADD COLUMN IF NOT EXISTS "width" DOUBLE PRECISION;
ALTER TABLE "catalog_products" ADD COLUMN IF NOT EXISTS "height" DOUBLE PRECISION;
ALTER TABLE "catalog_products" ADD COLUMN IF NOT EXISTS "dimension_unit" VARCHAR(10);

-- Add comments for documentation
COMMENT ON COLUMN "catalog_products"."delivery_min_days" IS 'Minimum delivery time in days';
COMMENT ON COLUMN "catalog_products"."delivery_max_days" IS 'Maximum delivery time in days';
COMMENT ON COLUMN "catalog_products"."weight" IS 'Product weight for shipping';
COMMENT ON COLUMN "catalog_products"."weight_unit" IS 'Weight unit (kg or g)';
COMMENT ON COLUMN "catalog_products"."length" IS 'Package length';
COMMENT ON COLUMN "catalog_products"."width" IS 'Package width';
COMMENT ON COLUMN "catalog_products"."height" IS 'Package height';
COMMENT ON COLUMN "catalog_products"."dimension_unit" IS 'Dimension unit (cm or m)';

