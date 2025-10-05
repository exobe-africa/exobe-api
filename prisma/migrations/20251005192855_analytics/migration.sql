-- DropForeignKey
ALTER TABLE "public"."catalog_products" DROP CONSTRAINT "catalog_products_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."catalog_products" DROP CONSTRAINT "catalog_products_vendor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."categories" DROP CONSTRAINT "categories_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."collection_products" DROP CONSTRAINT "collection_products_collection_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."collections" DROP CONSTRAINT "collections_vendor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."customer_addresses" DROP CONSTRAINT "customer_addresses_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."customer_notification_settings" DROP CONSTRAINT "customer_notification_settings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."customers" DROP CONSTRAINT "customers_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."discount_categories" DROP CONSTRAINT "discount_categories_discount_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."discount_collections" DROP CONSTRAINT "discount_collections_collection_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."discount_collections" DROP CONSTRAINT "discount_collections_discount_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."discount_products" DROP CONSTRAINT "discount_products_discount_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."discount_redemptions" DROP CONSTRAINT "discount_redemptions_discount_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."discount_redemptions" DROP CONSTRAINT "discount_redemptions_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."discounts" DROP CONSTRAINT "discounts_vendor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."gift_card_transactions" DROP CONSTRAINT "gift_card_transactions_gift_card_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."gift_card_transactions" DROP CONSTRAINT "gift_card_transactions_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."gift_cards" DROP CONSTRAINT "gift_cards_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."inventory_transactions" DROP CONSTRAINT "inventory_transactions_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_discount_items" DROP CONSTRAINT "order_discount_items_order_discount_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_discount_items" DROP CONSTRAINT "order_discount_items_order_item_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_discounts" DROP CONSTRAINT "order_discounts_discount_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_discounts" DROP CONSTRAINT "order_discounts_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_events" DROP CONSTRAINT "order_events_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_media" DROP CONSTRAINT "product_media_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_option_values" DROP CONSTRAINT "product_option_values_option_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_options" DROP CONSTRAINT "product_options_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_variant_media" DROP CONSTRAINT "product_variant_media_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_variant_option_values" DROP CONSTRAINT "product_variant_option_values_option_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_variant_option_values" DROP CONSTRAINT "product_variant_option_values_option_value_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_variant_option_values" DROP CONSTRAINT "product_variant_option_values_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_variants" DROP CONSTRAINT "product_variants_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."retailer_accounts" DROP CONSTRAINT "retailer_accounts_vendor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."return_events" DROP CONSTRAINT "return_events_return_request_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."return_items" DROP CONSTRAINT "return_items_order_item_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."return_items" DROP CONSTRAINT "return_items_return_request_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."return_requests" DROP CONSTRAINT "return_requests_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."return_requests" DROP CONSTRAINT "return_requests_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."reviews" DROP CONSTRAINT "reviews_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."reviews" DROP CONSTRAINT "reviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_addresses" DROP CONSTRAINT "user_addresses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."vendor_notification_settings" DROP CONSTRAINT "vendor_notification_settings_vendor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."vendors" DROP CONSTRAINT "vendors_account_manager_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."vendors" DROP CONSTRAINT "vendors_owner_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wholesaler_accounts" DROP CONSTRAINT "wholesaler_accounts_vendor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wishlist_items" DROP CONSTRAINT "wishlist_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wishlist_items" DROP CONSTRAINT "wishlist_items_wishlist_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wishlists" DROP CONSTRAINT "wishlists_user_id_fkey";

-- AlterTable
ALTER TABLE "catalog_products" DROP CONSTRAINT "catalog_products_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "vendor_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "category_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(191),
ALTER COLUMN "seo_title" SET DATA TYPE VARCHAR(70),
ALTER COLUMN "seo_description" SET DATA TYPE VARCHAR(160),
ADD CONSTRAINT "catalog_products_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(191),
ALTER COLUMN "parent_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "path" SET DATA TYPE VARCHAR(512),
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "collection_products" DROP CONSTRAINT "collection_products_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "collection_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "product_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "collection_products_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "collections" DROP CONSTRAINT "collections_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "vendor_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(191),
ALTER COLUMN "image" SET DATA TYPE VARCHAR(2048),
ADD CONSTRAINT "collections_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "contact_messages" DROP CONSTRAINT "contact_messages_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(254),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "subject" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "department" SET DATA TYPE VARCHAR(50),
ADD CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "customer_addresses" DROP CONSTRAINT "customer_addresses_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "customer_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "address_line1" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "address_line2" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "province" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "country" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "postal_code" SET DATA TYPE VARCHAR(20),
ADD CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "customer_notification_settings" DROP CONSTRAINT "customer_notification_settings_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "customer_notification_settings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "customers" DROP CONSTRAINT "customers_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(254),
ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "mobile" SET DATA TYPE VARCHAR(32),
ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "discount_categories" DROP CONSTRAINT "discount_categories_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "discount_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "category_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "discount_categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "discount_collections" DROP CONSTRAINT "discount_collections_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "discount_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "collection_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "discount_collections_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "discount_products" DROP CONSTRAINT "discount_products_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "discount_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "product_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "discount_products_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "discount_redemptions" DROP CONSTRAINT "discount_redemptions_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "discount_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "order_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "customer_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "code_used" SET DATA TYPE VARCHAR(50),
ADD CONSTRAINT "discount_redemptions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "discounts" DROP CONSTRAINT "discounts_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "code" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "vendor_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "created_by_user_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "discounts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "gift_card_transactions" DROP CONSTRAINT "gift_card_transactions_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "gift_card_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "order_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "gift_card_transactions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "gift_cards" DROP CONSTRAINT "gift_cards_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "code" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "customer_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "image" SET DATA TYPE VARCHAR(2048),
ADD CONSTRAINT "gift_cards_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "inventory_transactions" DROP CONSTRAINT "inventory_transactions_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "variant_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "inventory_transactions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "news_articles" DROP CONSTRAINT "news_articles_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "author" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "category" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "image" SET DATA TYPE VARCHAR(2048),
ADD CONSTRAINT "news_articles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "order_discount_items" DROP CONSTRAINT "order_discount_items_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "order_discount_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "order_item_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "product_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "product_variant_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "order_discount_items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "order_discounts" DROP CONSTRAINT "order_discounts_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "order_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "discount_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "code" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "order_discounts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "order_events" DROP CONSTRAINT "order_events_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "order_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "order_events_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "order_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "product_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "product_variant_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "vendor_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "sku" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(200),
ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "orders" DROP CONSTRAINT "orders_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "order_number" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "customer_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(254),
ALTER COLUMN "currency" SET DATA TYPE VARCHAR(3),
ALTER COLUMN "gift_card_code" SET DATA TYPE VARCHAR(64),
ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "payments" DROP CONSTRAINT "payments_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "order_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "provider" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "currency" SET DATA TYPE VARCHAR(3),
ALTER COLUMN "transaction_id" SET DATA TYPE VARCHAR(128),
ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "product_media" DROP CONSTRAINT "product_media_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "product_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "url" SET DATA TYPE VARCHAR(2048),
ADD CONSTRAINT "product_media_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "product_option_values" DROP CONSTRAINT "product_option_values_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "option_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "value" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "product_option_values_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "product_options" DROP CONSTRAINT "product_options_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "product_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "product_options_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "product_variant_media" DROP CONSTRAINT "product_variant_media_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "variant_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "url" SET DATA TYPE VARCHAR(2048),
ADD CONSTRAINT "product_variant_media_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "product_variant_option_values" DROP CONSTRAINT "product_variant_option_values_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "variant_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "option_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "option_value_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "product_variant_option_values_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "product_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "sku" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "barcode" SET DATA TYPE VARCHAR(64),
ADD CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "retailer_accounts" DROP CONSTRAINT "retailer_accounts_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "vendor_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "retailer_accounts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "return_events" DROP CONSTRAINT "return_events_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "return_request_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "return_events_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "return_items" DROP CONSTRAINT "return_items_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "return_request_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "order_item_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "reason" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "condition" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "return_items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "return_requests" DROP CONSTRAINT "return_requests_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "order_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "customer_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "reason" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "return_requests_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "product_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "seller_applications" DROP CONSTRAINT "seller_applications_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "business_type" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "applicant_type" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(254),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "landline" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "identification_type" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "business_name" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "business_registration" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "sa_id_number" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "vat_registered" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "vat_number" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "monthly_revenue" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "physical_stores" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "number_of_stores" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "supplier_to_retailers" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "other_marketplaces" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "province" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "postal_code" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "unique_products" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "primary_category" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "stock_type" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "owned_brands" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "reseller_brands" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "website" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "social_media" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "how_did_you_hear" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "seller_applications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "service_provider_applications" DROP CONSTRAINT "service_provider_applications_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(254),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "date_of_birth" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "id_number" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "identification_type" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "primary_service" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "portfolio" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "hourly_rate" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "availability" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "province" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "postal_code" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "service_radius" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "transport_mode" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "business_name" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "business_registration" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "vat_registered" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "vat_number" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "emergency_contact" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "background_check" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "how_did_you_hear" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "service_provider_applications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_addresses" DROP CONSTRAINT "user_addresses_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "address_line1" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "address_line2" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "province" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "country" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "postal_code" SET DATA TYPE VARCHAR(20),
ADD CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(254),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "mobile" SET DATA TYPE VARCHAR(32),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vat_rates" DROP CONSTRAINT "vat_rates_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "country" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "province" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "vat_rates_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vendor_notification_settings" DROP CONSTRAINT "vendor_notification_settings_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "vendor_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "vendor_notification_settings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vendors" DROP CONSTRAINT "vendors_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(191),
ALTER COLUMN "owner_user_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "account_manager_user_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "vendors_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "wholesaler_accounts" DROP CONSTRAINT "wholesaler_accounts_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "vendor_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "wholesaler_accounts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "wishlist_items" DROP CONSTRAINT "wishlist_items_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "wishlist_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "product_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "product_variant_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "wishlists" DROP CONSTRAINT "wishlists_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id");

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

-- AddForeignKey
ALTER TABLE "customer_notification_settings" ADD CONSTRAINT "customer_notification_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

