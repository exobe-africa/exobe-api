-- Add address_name and default_address columns to user_addresses table
ALTER TABLE "user_addresses" ADD COLUMN "address_name" VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE "user_addresses" ADD COLUMN "default_address" BOOLEAN NOT NULL DEFAULT false;

-- Backfill address_name with existing address_line2 values or empty string
UPDATE "user_addresses" SET "address_name" = COALESCE("address_line2", '');

-- Set one address per user as default if none is currently set
WITH ranked_addresses AS (
  SELECT 
    id, 
    user_id, 
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as rn
  FROM "user_addresses"
),
users_without_default AS (
  SELECT DISTINCT ua.user_id
  FROM "user_addresses" ua
  WHERE NOT EXISTS (
    SELECT 1 FROM "user_addresses" ua2 
    WHERE ua2.user_id = ua.user_id AND ua2.default_address = true
  )
)
UPDATE "user_addresses" 
SET "default_address" = true
FROM ranked_addresses ra, users_without_default uw
WHERE "user_addresses".id = ra.id 
  AND ra.user_id = uw.user_id 
  AND ra.rn = 1;
