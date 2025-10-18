-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'RETAILER', 'WHOLESALER', 'SERVICE_PROVIDER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'RETAILER', 'SERVICE_PROVIDER');

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
CREATE TYPE "ReturnStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'IN_TRANSIT', 'RECEIVED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReturnMethod" AS ENUM ('PICKUP', 'DROPOFF');

-- CreateEnum
CREATE TYPE "RefundMethod" AS ENUM ('ORIGINAL', 'STORE_CREDIT');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PRODUCT_AMOUNT', 'PRODUCT_PERCENT', 'BUY_X_GET_Y', 'ORDER_AMOUNT', 'ORDER_PERCENT', 'FREE_SHIPPING');

-- CreateEnum
CREATE TYPE "DiscountMethod" AS ENUM ('CODE', 'AUTOMATIC');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('GENERAL', 'BOOK', 'EBOOK', 'ELECTRONICS', 'CLOTHING', 'FOOD', 'BEVERAGE', 'HEALTH', 'BEAUTY', 'SPORTS', 'TOYS', 'AUTOMOTIVE', 'HOME', 'GARDEN', 'PET', 'JEWELRY', 'ART', 'MUSIC', 'SOFTWARE', 'SERVICE');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'MODEL3D');

-- CreateEnum
CREATE TYPE "InventoryReason" AS ENUM ('MANUAL_ADJUSTMENT', 'SALE', 'RETURN', 'RECEIVING', 'TRANSFER');

-- CreateEnum
CREATE TYPE "GiftCardStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "GiftCardTransactionType" AS ENUM ('ISSUE', 'REDEEM', 'REFUND', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "RootCategory" AS ENUM ('ANIMALS_PET_SUPPLIES', 'APPAREL_ACCESSORIES', 'ARTS_ENTERTAINMENT', 'BABY_TODDLER', 'BUSINESS_INDUSTRIAL', 'CAMERAS_OPTICS', 'ELECTRONICS', 'FOOD_BEVERAGES_TOBACCO', 'FURNITURE', 'HARDWARE', 'HEALTH_BEAUTY', 'HOME_GARDEN', 'LUGGAGE_BAGS', 'MATURE', 'MEDIA', 'OFFICE_SUPPLIES', 'RELIGIOUS_CEREMONIAL', 'SOFTWARE', 'SPORTING_GOODS', 'TOYS_GAMES', 'VEHICLES_PARTS', 'GIFT_CARDS', 'UNCATEGORIZED', 'SERVICES', 'PRODUCT_ADD_ONS', 'BUNDLES');

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(25) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(150),
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "phone" VARCHAR(32),
    "mobile" VARCHAR(32),
    "date_of_birth" TIMESTAMP(3),
    "agree_to_terms" BOOLEAN NOT NULL DEFAULT false,
    "subscribe_newsletter" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "roles" "UserRole"[] DEFAULT ARRAY[]::"UserRole"[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_notification_settings" (
    "id" VARCHAR(25) NOT NULL,
    "user_id" VARCHAR(25) NOT NULL,
    "order_confirmations" BOOLEAN NOT NULL DEFAULT true,
    "shipping_updates" BOOLEAN NOT NULL DEFAULT true,
    "delivery_notifications" BOOLEAN NOT NULL DEFAULT true,
    "product_recommendations" BOOLEAN NOT NULL DEFAULT false,
    "exclusive_deals" BOOLEAN NOT NULL DEFAULT false,
    "wishlist_updates" BOOLEAN NOT NULL DEFAULT false,
    "shopping_insights" BOOLEAN NOT NULL DEFAULT false,
    "login_alerts" BOOLEAN NOT NULL DEFAULT true,
    "password_changes" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_notification_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_applications" (
    "id" VARCHAR(25) NOT NULL,
    "seller_role" "Role" NOT NULL,
    "business_type" VARCHAR(50) NOT NULL,
    "applicant_type" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phone" VARCHAR(32) NOT NULL,
    "landline" VARCHAR(32),
    "identification_type" VARCHAR(50) NOT NULL,
    "business_name" VARCHAR(150) NOT NULL,
    "business_registration" VARCHAR(100),
    "sa_id_number" VARCHAR(20),
    "vat_registered" VARCHAR(10) NOT NULL,
    "vat_number" VARCHAR(64),
    "monthly_revenue" VARCHAR(50),
    "physical_stores" VARCHAR(10),
    "number_of_stores" VARCHAR(10),
    "supplier_to_retailers" VARCHAR(10),
    "other_marketplaces" VARCHAR(255),
    "address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "province" VARCHAR(100) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "unique_products" VARCHAR(255),
    "primary_category" VARCHAR(100) NOT NULL,
    "stock_type" VARCHAR(50) NOT NULL,
    "product_description" TEXT NOT NULL,
    "owned_brands" VARCHAR(255),
    "reseller_brands" VARCHAR(255),
    "website" VARCHAR(255),
    "social_media" VARCHAR(255),
    "business_summary" TEXT NOT NULL,
    "how_did_you_hear" VARCHAR(100) NOT NULL,
    "agree_to_terms" BOOLEAN NOT NULL DEFAULT false,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_rejection_reasons" (
    "id" VARCHAR(25) NOT NULL,
    "application_id" VARCHAR(25) NOT NULL,
    "application_type" VARCHAR(50) NOT NULL,
    "rejection_type" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "rejected_by_user_id" VARCHAR(25),
    "rejected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_rejection_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" VARCHAR(25) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phone" VARCHAR(32),
    "subject" VARCHAR(150) NOT NULL,
    "message" TEXT NOT NULL,
    "department" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_articles" (
    "id" VARCHAR(25) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" VARCHAR(100) NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL,
    "read_time" INTEGER NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "image" VARCHAR(2048) NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_provider_applications" (
    "id" VARCHAR(25) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phone" VARCHAR(32) NOT NULL,
    "date_of_birth" VARCHAR(20),
    "id_number" VARCHAR(50) NOT NULL,
    "identification_type" VARCHAR(50) NOT NULL,
    "service_categories" TEXT[],
    "primary_service" VARCHAR(100) NOT NULL,
    "experience" TEXT NOT NULL,
    "qualifications" TEXT,
    "portfolio" VARCHAR(255),
    "hourly_rate" VARCHAR(50) NOT NULL,
    "availability" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "province" VARCHAR(100) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "service_radius" VARCHAR(50) NOT NULL,
    "transport_mode" VARCHAR(50) NOT NULL,
    "business_name" VARCHAR(150),
    "business_registration" VARCHAR(100),
    "vat_registered" VARCHAR(10),
    "vat_number" VARCHAR(64),
    "bank_details" TEXT,
    "emergency_contact" VARCHAR(255),
    "work_samples" TEXT,
    "client_references" TEXT,
    "certifications" TEXT,
    "insurance" TEXT,
    "background_check" VARCHAR(10),
    "motivation" TEXT NOT NULL,
    "goals" TEXT,
    "how_did_you_hear" VARCHAR(100) NOT NULL,
    "agree_to_terms" BOOLEAN NOT NULL DEFAULT false,
    "agree_to_background" BOOLEAN NOT NULL DEFAULT false,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_provider_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" VARCHAR(25) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(191) NOT NULL,
    "description" TEXT,
    "owner_user_id" VARCHAR(25) NOT NULL,
    "account_manager_user_id" VARCHAR(25),
    "status" "VendorStatus" NOT NULL DEFAULT 'PENDING',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "seller_type" "SellerType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_addresses" (
    "id" VARCHAR(25) NOT NULL,
    "user_id" VARCHAR(25) NOT NULL,
    "type" "AddressType" NOT NULL DEFAULT 'BUSINESS',
    "address_name" VARCHAR(255) NOT NULL,
    "address_line1" VARCHAR(255) NOT NULL,
    "address_line2" VARCHAR(255),
    "city" VARCHAR(100) NOT NULL,
    "province" VARCHAR(100),
    "country" VARCHAR(100) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "default_address" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" VARCHAR(25) NOT NULL,
    "user_id" VARCHAR(25),
    "email" VARCHAR(254) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(32),
    "mobile" VARCHAR(32),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_addresses" (
    "id" VARCHAR(25) NOT NULL,
    "customer_id" VARCHAR(25) NOT NULL,
    "type" "AddressType" NOT NULL DEFAULT 'BUSINESS',
    "address_line1" VARCHAR(255) NOT NULL,
    "address_line2" VARCHAR(255),
    "city" VARCHAR(100) NOT NULL,
    "province" VARCHAR(100),
    "country" VARCHAR(100) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" VARCHAR(25) NOT NULL,
    "order_number" VARCHAR(40) NOT NULL,
    "customer_id" VARCHAR(25) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'INITIATED',
    "currency" VARCHAR(3) NOT NULL DEFAULT 'ZAR',
    "subtotal_cents" INTEGER NOT NULL,
    "shipping_cents" INTEGER NOT NULL DEFAULT 0,
    "vat_cents" INTEGER NOT NULL DEFAULT 0,
    "total_cents" INTEGER NOT NULL,
    "gift_card_amount_cents" INTEGER NOT NULL DEFAULT 0,
    "gift_card_code" VARCHAR(64),
    "invoice_url" VARCHAR(2048),
    "receipt_url" VARCHAR(2048),
    "shipping_address" JSONB NOT NULL,
    "billing_address" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" VARCHAR(25) NOT NULL,
    "order_id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,
    "product_variant_id" VARCHAR(25) NOT NULL,
    "vendor_id" VARCHAR(25) NOT NULL,
    "sku" VARCHAR(64) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "attributes" JSONB NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_cents" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" VARCHAR(25) NOT NULL,
    "order_id" VARCHAR(25) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'INITIATED',
    "amount_cents" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'ZAR',
    "transaction_id" VARCHAR(128),
    "raw_response" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_requests" (
    "id" VARCHAR(25) NOT NULL,
    "order_id" VARCHAR(25) NOT NULL,
    "customer_id" VARCHAR(25) NOT NULL,
    "status" "ReturnStatus" NOT NULL DEFAULT 'REQUESTED',
    "return_method" "ReturnMethod" NOT NULL DEFAULT 'PICKUP',
    "refund_method" "RefundMethod" NOT NULL DEFAULT 'ORIGINAL',
    "reason" VARCHAR(255),
    "total_refund_cents" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_items" (
    "id" VARCHAR(25) NOT NULL,
    "return_request_id" VARCHAR(25) NOT NULL,
    "order_item_id" VARCHAR(25) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "reason" VARCHAR(255) NOT NULL,
    "condition" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "refund_cents" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_events" (
    "id" VARCHAR(25) NOT NULL,
    "return_request_id" VARCHAR(25) NOT NULL,
    "status" "ReturnStatus" NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "return_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_events" (
    "id" VARCHAR(25) NOT NULL,
    "order_id" VARCHAR(25) NOT NULL,
    "status" "OrderStatus",
    "payment_status" "PaymentStatus",
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discounts" (
    "id" VARCHAR(25) NOT NULL,
    "code" VARCHAR(50),
    "title" VARCHAR(150),
    "description" TEXT,
    "type" "DiscountType" NOT NULL,
    "method" "DiscountMethod" NOT NULL DEFAULT 'CODE',
    "vendor_id" VARCHAR(25),
    "created_by_user_id" VARCHAR(25),
    "amount_cents" INTEGER,
    "percent" INTEGER,
    "buy_x_quantity" INTEGER,
    "get_y_quantity" INTEGER,
    "min_purchase_amount_cents" INTEGER,
    "min_quantity" INTEGER,
    "usage_limit_total" INTEGER,
    "usage_limit_per_customer" INTEGER,
    "applies_to_all_products" BOOLEAN NOT NULL DEFAULT false,
    "combine_with_product" BOOLEAN NOT NULL DEFAULT true,
    "combine_with_order" BOOLEAN NOT NULL DEFAULT false,
    "combine_with_shipping" BOOLEAN NOT NULL DEFAULT false,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "shipping_countries" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" VARCHAR(25) NOT NULL,
    "vendor_id" VARCHAR(25) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(191) NOT NULL,
    "description" TEXT,
    "image" VARCHAR(2048),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_products" (
    "id" VARCHAR(25) NOT NULL,
    "collection_id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,

    CONSTRAINT "collection_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_collections" (
    "id" VARCHAR(25) NOT NULL,
    "discount_id" VARCHAR(25) NOT NULL,
    "collection_id" VARCHAR(25) NOT NULL,

    CONSTRAINT "discount_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_notification_settings" (
    "id" VARCHAR(25) NOT NULL,
    "vendor_id" VARCHAR(25) NOT NULL,
    "email_notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    "order_new" BOOLEAN NOT NULL DEFAULT true,
    "order_paid" BOOLEAN NOT NULL DEFAULT true,
    "order_cancelled" BOOLEAN NOT NULL DEFAULT true,
    "order_refunded" BOOLEAN NOT NULL DEFAULT true,
    "return_requested" BOOLEAN NOT NULL DEFAULT true,
    "low_stock" BOOLEAN NOT NULL DEFAULT true,
    "low_stock_threshold" INTEGER NOT NULL DEFAULT 5,
    "product_status_change" BOOLEAN NOT NULL DEFAULT true,
    "review_received" BOOLEAN NOT NULL DEFAULT true,
    "payout_sent" BOOLEAN NOT NULL DEFAULT true,
    "message_received" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_notification_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_products" (
    "id" VARCHAR(25) NOT NULL,
    "discount_id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,

    CONSTRAINT "discount_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_categories" (
    "id" VARCHAR(25) NOT NULL,
    "discount_id" VARCHAR(25) NOT NULL,
    "category_id" VARCHAR(25) NOT NULL,

    CONSTRAINT "discount_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_redemptions" (
    "id" VARCHAR(25) NOT NULL,
    "discount_id" VARCHAR(25) NOT NULL,
    "order_id" VARCHAR(25),
    "customer_id" VARCHAR(25),
    "amount_cents" INTEGER NOT NULL DEFAULT 0,
    "code_used" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discount_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_discounts" (
    "id" VARCHAR(25) NOT NULL,
    "order_id" VARCHAR(25) NOT NULL,
    "discount_id" VARCHAR(25),
    "code" VARCHAR(50),
    "amount_cents" INTEGER NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "order_discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_discount_items" (
    "id" VARCHAR(25) NOT NULL,
    "order_discount_id" VARCHAR(25) NOT NULL,
    "order_item_id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,
    "product_variant_id" VARCHAR(25) NOT NULL,
    "amount_cents" INTEGER NOT NULL,

    CONSTRAINT "order_discount_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retailer_accounts" (
    "id" VARCHAR(25) NOT NULL,
    "vendor_id" VARCHAR(25) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "retailer_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wholesaler_accounts" (
    "id" VARCHAR(25) NOT NULL,
    "vendor_id" VARCHAR(25) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wholesaler_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" VARCHAR(25) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(191) NOT NULL,
    "description" TEXT,
    "parent_id" VARCHAR(25),
    "path" VARCHAR(512) NOT NULL,
    "root" "RootCategory",
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_products" (
    "id" VARCHAR(25) NOT NULL,
    "vendor_id" VARCHAR(25) NOT NULL,
    "category_id" VARCHAR(25) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(191) NOT NULL,
    "description" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "product_type" "ProductType" NOT NULL DEFAULT 'GENERAL',
    "seo_title" VARCHAR(70),
    "seo_description" VARCHAR(160),
    "features" TEXT[],
    "available_locations" TEXT[],
    "tags" TEXT[],
    "delivery_min_days" INTEGER,
    "delivery_max_days" INTEGER,
    "weight" DOUBLE PRECISION,
    "weight_unit" VARCHAR(10),
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "dimension_unit" VARCHAR(10),
    "brand" VARCHAR(150),
    "model" VARCHAR(150),
    "material" VARCHAR(200),
    "pickup_location_id" VARCHAR(25),
    "return_policy_id" VARCHAR(25),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_book_details" (
    "id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,
    "isbn" VARCHAR(17),
    "author" VARCHAR(200),
    "publisher" VARCHAR(200),
    "publication_date" TIMESTAMP(3),
    "pages" INTEGER,
    "language" VARCHAR(50),
    "genre" VARCHAR(100),
    "format" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_book_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_consumable_details" (
    "id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,
    "expiry_date" TIMESTAMP(3),
    "ingredients" JSONB,
    "nutritional_info" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_consumable_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_electronics_details" (
    "id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,
    "warranty_period" INTEGER,
    "energy_rating" VARCHAR(10),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_electronics_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_media_details" (
    "id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,
    "artist" VARCHAR(200),
    "genre" VARCHAR(100),
    "format" VARCHAR(100),
    "release_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_media_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_software_details" (
    "id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,
    "platform" VARCHAR(100),
    "license_type" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_software_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_service_details" (
    "id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,
    "service_duration" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_service_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_compliance_details" (
    "id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,
    "certification" VARCHAR(200),
    "age_rating" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_compliance_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_pickup_locations" (
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
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pickup_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_return_policies" (
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
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_return_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_reviews" (
    "id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,
    "user_id" VARCHAR(25) NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,
    "sku" VARCHAR(64),
    "isbn" VARCHAR(17),
    "title" VARCHAR(200) NOT NULL,
    "attributes" JSONB NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "compare_at_price_cents" INTEGER,
    "barcode" VARCHAR(64),
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
    "id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_option_values" (
    "id" VARCHAR(25) NOT NULL,
    "option_id" VARCHAR(25) NOT NULL,
    "value" VARCHAR(100) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_option_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_option_values" (
    "id" VARCHAR(25) NOT NULL,
    "variant_id" VARCHAR(25) NOT NULL,
    "option_id" VARCHAR(25) NOT NULL,
    "option_value_id" VARCHAR(25) NOT NULL,

    CONSTRAINT "product_variant_option_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_media" (
    "id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_media" (
    "id" VARCHAR(25) NOT NULL,
    "variant_id" VARCHAR(25) NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_variant_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlists" (
    "id" VARCHAR(25) NOT NULL,
    "user_id" VARCHAR(25) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist_items" (
    "id" VARCHAR(25) NOT NULL,
    "wishlist_id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(25) NOT NULL,
    "product_variant_id" VARCHAR(25),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_transactions" (
    "id" VARCHAR(25) NOT NULL,
    "variant_id" VARCHAR(25) NOT NULL,
    "change" INTEGER NOT NULL,
    "reason" "InventoryReason" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vat_rates" (
    "id" VARCHAR(25) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "province" VARCHAR(100),
    "rate" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vat_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_cards" (
    "id" VARCHAR(25) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "customer_id" VARCHAR(25),
    "initial_value_cents" INTEGER NOT NULL,
    "balance_cents" INTEGER NOT NULL,
    "status" "GiftCardStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "image" VARCHAR(2048),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gift_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_card_transactions" (
    "id" VARCHAR(25) NOT NULL,
    "gift_card_id" VARCHAR(25) NOT NULL,
    "type" "GiftCardTransactionType" NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "notes" TEXT,
    "order_id" VARCHAR(25),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gift_card_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" VARCHAR(25) NOT NULL,
    "user_id" VARCHAR(25),
    "session_id" VARCHAR(50),
    "event_type" VARCHAR(50) NOT NULL,
    "page_path" VARCHAR(512),
    "page_title" VARCHAR(200),
    "referrer" VARCHAR(512),
    "product_id" VARCHAR(25),
    "collection_id" VARCHAR(25),
    "vendor_id" VARCHAR(25),
    "search_query" VARCHAR(200),
    "duration_ms" INTEGER,
    "scroll_depth" INTEGER,
    "attributes" JSONB,
    "user_agent" VARCHAR(512),
    "ip" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_engagement_stats" (
    "id" VARCHAR(25) NOT NULL,
    "user_id" VARCHAR(25) NOT NULL,
    "first_active_date" TIMESTAMP(3) NOT NULL,
    "last_active_date" TIMESTAMP(3) NOT NULL,
    "days_active_count" INTEGER NOT NULL DEFAULT 0,
    "current_streak_days" INTEGER NOT NULL DEFAULT 0,
    "longest_streak_days" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_engagement_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_daily_active" (
    "id" VARCHAR(25) NOT NULL,
    "user_id" VARCHAR(25) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "session_count" INTEGER NOT NULL DEFAULT 0,
    "event_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_daily_active_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_subscriptions" (
    "id" VARCHAR(25) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customer_notification_settings_user_id_key" ON "customer_notification_settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_slug_key" ON "vendors"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "customers_user_id_key" ON "customers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX "discounts_code_key" ON "discounts"("code");

-- CreateIndex
CREATE UNIQUE INDEX "collections_slug_key" ON "collections"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "collection_products_collection_id_product_id_key" ON "collection_products"("collection_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "discount_collections_discount_id_collection_id_key" ON "discount_collections"("discount_id", "collection_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_notification_settings_vendor_id_key" ON "vendor_notification_settings"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "discount_products_discount_id_product_id_key" ON "discount_products"("discount_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "discount_categories_discount_id_category_id_key" ON "discount_categories"("discount_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "retailer_accounts_vendor_id_key" ON "retailer_accounts"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "wholesaler_accounts_vendor_id_key" ON "wholesaler_accounts"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_products_slug_key" ON "catalog_products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_book_details_product_id_key" ON "product_book_details"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_consumable_details_product_id_key" ON "product_consumable_details"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_electronics_details_product_id_key" ON "product_electronics_details"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_media_details_product_id_key" ON "product_media_details"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_software_details_product_id_key" ON "product_software_details"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_service_details_product_id_key" ON "product_service_details"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_compliance_details_product_id_key" ON "product_compliance_details"("product_id");

-- CreateIndex
CREATE INDEX "product_pickup_locations_vendor_id_idx" ON "product_pickup_locations"("vendor_id");

-- CreateIndex
CREATE INDEX "product_return_policies_vendor_id_idx" ON "product_return_policies"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_reviews_product_id_user_id_key" ON "product_reviews"("product_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_isbn_key" ON "product_variants"("isbn");

-- CreateIndex
CREATE INDEX "product_variant_option_values_variant_id_idx" ON "product_variant_option_values"("variant_id");

-- CreateIndex
CREATE INDEX "product_variant_option_values_option_id_idx" ON "product_variant_option_values"("option_id");

-- CreateIndex
CREATE INDEX "product_variant_option_values_option_value_id_idx" ON "product_variant_option_values"("option_value_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_option_values_variant_id_option_id_key" ON "product_variant_option_values"("variant_id", "option_id");

-- CreateIndex
CREATE UNIQUE INDEX "wishlists_user_id_key" ON "wishlists"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_wishlist_id_product_id_product_variant_id_key" ON "wishlist_items"("wishlist_id", "product_id", "product_variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "vat_rates_country_province_key" ON "vat_rates"("country", "province");

-- CreateIndex
CREATE UNIQUE INDEX "gift_cards_code_key" ON "gift_cards"("code");

-- CreateIndex
CREATE INDEX "analytics_events_user_id_idx" ON "analytics_events"("user_id");

-- CreateIndex
CREATE INDEX "analytics_events_session_id_idx" ON "analytics_events"("session_id");

-- CreateIndex
CREATE INDEX "analytics_events_event_type_idx" ON "analytics_events"("event_type");

-- CreateIndex
CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events"("created_at");

-- CreateIndex
CREATE INDEX "analytics_events_product_id_idx" ON "analytics_events"("product_id");

-- CreateIndex
CREATE INDEX "analytics_events_collection_id_idx" ON "analytics_events"("collection_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_engagement_stats_user_id_key" ON "user_engagement_stats"("user_id");

-- CreateIndex
CREATE INDEX "user_daily_active_date_idx" ON "user_daily_active"("date");

-- CreateIndex
CREATE UNIQUE INDEX "user_daily_active_user_id_date_key" ON "user_daily_active"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "email_subscriptions_email_key" ON "email_subscriptions"("email");

-- AddForeignKey
ALTER TABLE "customer_notification_settings" ADD CONSTRAINT "customer_notification_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_rejection_reasons" ADD CONSTRAINT "application_rejection_reasons_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "seller_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_return_request_id_fkey" FOREIGN KEY ("return_request_id") REFERENCES "return_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_events" ADD CONSTRAINT "return_events_return_request_id_fkey" FOREIGN KEY ("return_request_id") REFERENCES "return_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_events" ADD CONSTRAINT "order_events_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_collections" ADD CONSTRAINT "discount_collections_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_collections" ADD CONSTRAINT "discount_collections_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_notification_settings" ADD CONSTRAINT "vendor_notification_settings_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_products" ADD CONSTRAINT "discount_products_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_categories" ADD CONSTRAINT "discount_categories_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_redemptions" ADD CONSTRAINT "discount_redemptions_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_redemptions" ADD CONSTRAINT "discount_redemptions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_discounts" ADD CONSTRAINT "order_discounts_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_discounts" ADD CONSTRAINT "order_discounts_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_discount_items" ADD CONSTRAINT "order_discount_items_order_discount_id_fkey" FOREIGN KEY ("order_discount_id") REFERENCES "order_discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_discount_items" ADD CONSTRAINT "order_discount_items_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "catalog_products" ADD CONSTRAINT "catalog_products_pickup_location_id_fkey" FOREIGN KEY ("pickup_location_id") REFERENCES "product_pickup_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_products" ADD CONSTRAINT "catalog_products_return_policy_id_fkey" FOREIGN KEY ("return_policy_id") REFERENCES "product_return_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_book_details" ADD CONSTRAINT "product_book_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_consumable_details" ADD CONSTRAINT "product_consumable_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_electronics_details" ADD CONSTRAINT "product_electronics_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media_details" ADD CONSTRAINT "product_media_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_software_details" ADD CONSTRAINT "product_software_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_service_details" ADD CONSTRAINT "product_service_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_compliance_details" ADD CONSTRAINT "product_compliance_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_pickup_locations" ADD CONSTRAINT "product_pickup_locations_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_return_policies" ADD CONSTRAINT "product_return_policies_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_wishlist_id_fkey" FOREIGN KEY ("wishlist_id") REFERENCES "wishlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_card_transactions" ADD CONSTRAINT "gift_card_transactions_gift_card_id_fkey" FOREIGN KEY ("gift_card_id") REFERENCES "gift_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_card_transactions" ADD CONSTRAINT "gift_card_transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_engagement_stats" ADD CONSTRAINT "user_engagement_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_active" ADD CONSTRAINT "user_daily_active_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

