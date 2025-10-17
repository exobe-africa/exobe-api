-- Create normalized return policies table
-- Allows multiple products to share return policies and easier management

CREATE TABLE IF NOT EXISTS "product_return_policies" (
  id                     VARCHAR(25) PRIMARY KEY DEFAULT substr(replace(gen_random_uuid()::text,'-',''),1,25),
  vendor_id              VARCHAR(25) NOT NULL REFERENCES "vendors"(id) ON DELETE CASCADE,
  name                   VARCHAR(100) NOT NULL,
  returns_accepted       BOOLEAN DEFAULT true,
  return_period_days     INTEGER,
  return_conditions      TEXT,
  restocking_fee_pct     DECIMAL(5,2),
  return_shipping_paid_by VARCHAR(20),
  is_default             BOOLEAN DEFAULT false,
  is_active              BOOLEAN DEFAULT true,
  created_at             TIMESTAMP(3) DEFAULT now(),
  updated_at             TIMESTAMP(3) DEFAULT now()
);

-- Add index for vendor lookups
CREATE INDEX IF NOT EXISTS "product_return_policies_vendor_id_idx" ON "product_return_policies"(vendor_id);

-- Add foreign key to catalog_products
ALTER TABLE "catalog_products" 
ADD COLUMN IF NOT EXISTS "return_policy_id" VARCHAR(25) REFERENCES "product_return_policies"(id) ON DELETE SET NULL;

-- Add index for product return policy lookups
CREATE INDEX IF NOT EXISTS "catalog_products_return_policy_id_idx" ON "catalog_products"(return_policy_id);

-- Add comments
COMMENT ON TABLE "product_return_policies" IS 'Normalized return policies for vendor products - allows reuse across multiple products';
COMMENT ON COLUMN "product_return_policies"."name" IS 'Policy name (e.g., "Standard 30-Day Returns", "No Returns - Final Sale")';
COMMENT ON COLUMN "product_return_policies"."returns_accepted" IS 'Whether returns are accepted (false = Final Sale)';
COMMENT ON COLUMN "product_return_policies"."return_period_days" IS 'Days to return (e.g., 7, 14, 30, 90)';
COMMENT ON COLUMN "product_return_policies"."return_conditions" IS 'Specific conditions (e.g., "Unopened packaging", "With receipt")';
COMMENT ON COLUMN "product_return_policies"."restocking_fee_pct" IS 'Restocking fee percentage (0-100). E.g., 15.00 = 15%';
COMMENT ON COLUMN "product_return_policies"."return_shipping_paid_by" IS 'Who pays return shipping: CUSTOMER, VENDOR, or SHARED';
COMMENT ON COLUMN "product_return_policies"."is_default" IS 'If true, automatically applied to new products';
COMMENT ON COLUMN "product_return_policies"."is_active" IS 'If false, policy is archived';
COMMENT ON COLUMN "catalog_products"."return_policy_id" IS 'Reference to return policy for this product';

-- Example preset policies for vendors (optional, run after vendor creation):
-- INSERT INTO "product_return_policies" (vendor_id, name, returns_accepted, return_period_days, return_conditions, restocking_fee_pct, return_shipping_paid_by, is_default)
-- VALUES 
--   ('VENDOR_ID', 'Standard 30-Day Returns', true, 30, '• Product must be unopened\n• Original packaging required', 0, 'CUSTOMER', true),
--   ('VENDOR_ID', 'Premium Free Returns', true, 30, '• Unused condition\n• Free return shipping', 0, 'VENDOR', false),
--   ('VENDOR_ID', 'Final Sale - No Returns', false, NULL, NULL, NULL, NULL, false);

