-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'RETAILER', 'WHOLESALER', 'SERVICE_PROVIDER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SellerType" AS ENUM ('RETAILER', 'WHOLESALER');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('BUSINESS', 'BILLING', 'SHIPPING', 'PERSONAL');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'FULFILLED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('INITIATED', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'MODEL3D');

-- CreateEnum
CREATE TYPE "InventoryReason" AS ENUM ('MANUAL_ADJUSTMENT', 'SALE', 'RETURN', 'RECEIVING', 'TRANSFER');

-- CreateEnum
CREATE TYPE "RootCategory" AS ENUM ('ANIMALS_PET_SUPPLIES', 'APPAREL_ACCESSORIES', 'ARTS_ENTERTAINMENT', 'BABY_TODDLER', 'BUSINESS_INDUSTRIAL', 'CAMERAS_OPTICS', 'ELECTRONICS', 'FOOD_BEVERAGES_TOBACCO', 'FURNITURE', 'HARDWARE', 'HEALTH_BEAUTY', 'HOME_GARDEN', 'LUGGAGE_BAGS', 'MATURE', 'MEDIA', 'OFFICE_SUPPLIES', 'RELIGIOUS_CEREMONIAL', 'SOFTWARE', 'SPORTING_GOODS', 'TOYS_GAMES', 'VEHICLES_PARTS', 'GIFT_CARDS', 'UNCATEGORIZED', 'SERVICES', 'PRODUCT_ADD_ONS', 'BUNDLES');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "agree_to_terms" BOOLEAN NOT NULL DEFAULT false,
    "subscribe_newsletter" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_applications" (
    "id" TEXT NOT NULL,
    "seller_role" "Role" NOT NULL,
    "business_type" TEXT NOT NULL,
    "applicant_type" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "landline" TEXT,
    "identification_type" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "business_registration" TEXT,
    "sa_id_number" TEXT,
    "vat_registered" TEXT NOT NULL,
    "vat_number" TEXT,
    "monthly_revenue" TEXT,
    "physical_stores" TEXT,
    "number_of_stores" TEXT,
    "supplier_to_retailers" TEXT,
    "other_marketplaces" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "unique_products" TEXT,
    "primary_category" TEXT NOT NULL,
    "stock_type" TEXT NOT NULL,
    "product_description" TEXT NOT NULL,
    "owned_brands" TEXT,
    "reseller_brands" TEXT,
    "website" TEXT,
    "social_media" TEXT,
    "business_summary" TEXT NOT NULL,
    "how_did_you_hear" TEXT NOT NULL,
    "agree_to_terms" BOOLEAN NOT NULL DEFAULT false,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "department" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL,
    "read_time" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_provider_applications" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "date_of_birth" TEXT,
    "id_number" TEXT NOT NULL,
    "identification_type" TEXT NOT NULL,
    "service_categories" TEXT[],
    "primary_service" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "qualifications" TEXT,
    "portfolio" TEXT,
    "hourly_rate" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "service_radius" TEXT NOT NULL,
    "transport_mode" TEXT NOT NULL,
    "business_name" TEXT,
    "business_registration" TEXT,
    "vat_registered" TEXT,
    "vat_number" TEXT,
    "bank_details" TEXT,
    "emergency_contact" TEXT,
    "work_samples" TEXT,
    "client_references" TEXT,
    "certifications" TEXT,
    "insurance" TEXT,
    "background_check" TEXT,
    "motivation" TEXT NOT NULL,
    "goals" TEXT,
    "how_did_you_hear" TEXT NOT NULL,
    "agree_to_terms" BOOLEAN NOT NULL DEFAULT false,
    "agree_to_background" BOOLEAN NOT NULL DEFAULT false,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_provider_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "owner_user_id" TEXT NOT NULL,
    "account_manager_user_id" TEXT,
    "status" "VendorStatus" NOT NULL DEFAULT 'PENDING',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "seller_type" "SellerType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_addresses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "AddressType" NOT NULL DEFAULT 'BUSINESS',
    "address_line1" TEXT NOT NULL,
    "address_line2" TEXT,
    "city" TEXT NOT NULL,
    "province" TEXT,
    "country" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "mobile" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_addresses" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "type" "AddressType" NOT NULL DEFAULT 'BUSINESS',
    "address_line1" TEXT NOT NULL,
    "address_line2" TEXT,
    "city" TEXT NOT NULL,
    "province" TEXT,
    "country" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "order_number" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'INITIATED',
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "subtotal_cents" INTEGER NOT NULL,
    "shipping_cents" INTEGER NOT NULL DEFAULT 0,
    "vat_cents" INTEGER NOT NULL DEFAULT 0,
    "total_cents" INTEGER NOT NULL,
    "shipping_address" JSONB NOT NULL,
    "billing_address" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_variant_id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_cents" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'INITIATED',
    "amount_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "transaction_id" TEXT,
    "raw_response" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retailer_accounts" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "retailer_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wholesaler_accounts" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wholesaler_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "parent_id" TEXT,
    "path" TEXT NOT NULL,
    "root" "RootCategory",
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_products" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "features" TEXT[],
    "available_locations" TEXT[],
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "compare_at_price_cents" INTEGER,
    "barcode" TEXT,
    "weight_grams" INTEGER DEFAULT 0,
    "track_inventory" BOOLEAN NOT NULL DEFAULT true,
    "allow_backorder" BOOLEAN NOT NULL DEFAULT false,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "available_locations" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_options" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_option_values" (
    "id" TEXT NOT NULL,
    "option_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_option_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_option_values" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "option_id" TEXT NOT NULL,
    "option_value_id" TEXT NOT NULL,

    CONSTRAINT "product_variant_option_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_media" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_media" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_variant_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_transactions" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "change" INTEGER NOT NULL,
    "reason" "InventoryReason" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vat_rates" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "province" TEXT,
    "rate" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vat_rates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_slug_key" ON "vendors"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "customers_user_id_key" ON "customers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX "retailer_accounts_vendor_id_key" ON "retailer_accounts"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "wholesaler_accounts_vendor_id_key" ON "wholesaler_accounts"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_products_slug_key" ON "catalog_products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");

-- CreateIndex
CREATE INDEX "product_variant_option_values_variant_id_idx" ON "product_variant_option_values"("variant_id");

-- CreateIndex
CREATE INDEX "product_variant_option_values_option_id_idx" ON "product_variant_option_values"("option_id");

-- CreateIndex
CREATE INDEX "product_variant_option_values_option_value_id_idx" ON "product_variant_option_values"("option_value_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_option_values_variant_id_option_id_key" ON "product_variant_option_values"("variant_id", "option_id");

-- CreateIndex
CREATE UNIQUE INDEX "vat_rates_country_province_key" ON "vat_rates"("country", "province");

-- AddForeignKey
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_account_manager_user_id_fkey" FOREIGN KEY ("account_manager_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retailer_accounts" ADD CONSTRAINT "retailer_accounts_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wholesaler_accounts" ADD CONSTRAINT "wholesaler_accounts_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_products" ADD CONSTRAINT "catalog_products_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_products" ADD CONSTRAINT "catalog_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_option_values" ADD CONSTRAINT "product_option_values_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "product_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_option_values" ADD CONSTRAINT "product_variant_option_values_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_option_values" ADD CONSTRAINT "product_variant_option_values_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "product_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_option_values" ADD CONSTRAINT "product_variant_option_values_option_value_id_fkey" FOREIGN KEY ("option_value_id") REFERENCES "product_option_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_media" ADD CONSTRAINT "product_variant_media_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
