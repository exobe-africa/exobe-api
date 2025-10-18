-- Migration: Change return_conditions from TEXT to array
-- This migration converts the return_conditions field from TEXT to TEXT[]

BEGIN;

-- Step 1: Add a temporary array column
ALTER TABLE "product_return_policies" 
ADD COLUMN IF NOT EXISTS "return_conditions_temp" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Step 2: Migrate existing data (split by newlines if present)
UPDATE "product_return_policies"
SET "return_conditions_temp" = 
  CASE 
    WHEN "return_conditions" IS NULL THEN ARRAY[]::TEXT[]
    WHEN "return_conditions" = '' THEN ARRAY[]::TEXT[]
    ELSE string_to_array(regexp_replace("return_conditions", '•\s*', '', 'g'), E'\n')
  END
WHERE "return_conditions_temp" IS NULL OR array_length("return_conditions_temp", 1) IS NULL;

-- Step 3: Remove the old column
ALTER TABLE "product_return_policies" 
DROP COLUMN IF EXISTS "return_conditions";

-- Step 4: Rename the temporary column to the original name
ALTER TABLE "product_return_policies" 
RENAME COLUMN "return_conditions_temp" TO "return_conditions";

-- Step 5: Clean up empty strings from the array
UPDATE "product_return_policies"
SET "return_conditions" = array_remove("return_conditions", '')
WHERE array_position("return_conditions", '') IS NOT NULL;

COMMIT;

-- Verify the migration
-- SELECT id, name, return_conditions FROM product_return_policies;

