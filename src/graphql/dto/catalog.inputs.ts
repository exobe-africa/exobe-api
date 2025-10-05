import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateVendorInput {
  @Field()
  name: string;
  @Field()
  slug: string;
  @Field({ nullable: true })
  @IsOptional()
  description?: string;
}

@InputType()
export class CreateCategoryInput {
  @Field()
  name: string;
  @Field()
  slug: string;
  @Field({ nullable: true })
  @IsOptional()
  description?: string;
  @Field({ nullable: true })
  @IsOptional()
  parentId?: string;
  @Field()
  path: string;
}

@InputType()
export class CreateProductInput {
  @Field()
  vendorId: string;
  @Field()
  categoryId: string;
  @Field()
  title: string;
  @Field()
  slug: string;
  @Field({ nullable: true })
  @IsOptional()
  description?: string;
  @Field(() => [String], { nullable: true })
  @IsOptional()
  features?: string[];
  @Field(() => [String], { nullable: true })
  @IsOptional()
  availableLocations?: string[];
  @Field({ nullable: true })
  @IsOptional()
  status?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  @Field(() => [MediaUploadInput], { nullable: true })
  @IsOptional()
  mediaUploads?: MediaUploadInput[];
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  @IsOptional()
  categoryId?: string;
  @Field({ nullable: true })
  @IsOptional()
  title?: string;
  @Field({ nullable: true })
  @IsOptional()
  slug?: string;
  @Field({ nullable: true })
  @IsOptional()
  description?: string;
  @Field(() => [String], { nullable: true })
  @IsOptional()
  features?: string[];
  @Field(() => [String], { nullable: true })
  @IsOptional()
  availableLocations?: string[];
  @Field({ nullable: true })
  @IsOptional()
  status?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  @Field(() => [MediaUploadInput], { nullable: true })
  @IsOptional()
  mediaUploads?: MediaUploadInput[];
}

@InputType()
export class CreateVariantInput {
  @Field()
  productId: string;
  @Field()
  sku: string;
  @Field()
  title: string;
  @Field(() => [VariantAttributeInput])
  attributes: VariantAttributeInput[];
  @Field()
  @IsInt()
  @Min(0)
  priceCents: number;
  @Field({ nullable: true })
  @IsOptional()
  compareAtPriceCents?: number;
  @Field({ nullable: true })
  @IsOptional()
  barcode?: string;
  @Field({ nullable: true })
  @IsOptional()
  weightGrams?: number;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  allowBackorder?: boolean;
  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  stockQuantity?: number;
  @Field(() => [String], { nullable: true })
  @IsOptional()
  availableLocations?: string[];
}

@InputType()
export class UpdateVariantInput {
  @Field({ nullable: true })
  @IsOptional()
  sku?: string;
  @Field({ nullable: true })
  @IsOptional()
  title?: string;
  @Field(() => [VariantAttributeInput], { nullable: true })
  @IsOptional()
  attributes?: VariantAttributeInput[];
  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  priceCents?: number;
  @Field({ nullable: true })
  @IsOptional()
  compareAtPriceCents?: number;
  @Field({ nullable: true })
  @IsOptional()
  barcode?: string;
  @Field({ nullable: true })
  @IsOptional()
  weightGrams?: number;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  allowBackorder?: boolean;
  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  stockQuantity?: number;
}

@InputType()
export class VariantAttributeInput {
  @Field()
  name: string;
  @Field()
  value: string;
}

export function attributesArrayToRecord(attrs: VariantAttributeInput[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const a of attrs) out[a.name] = a.value;
  return out;
}

@InputType()
export class InventoryAdjustInput {
  @Field(() => ID)
  variantId: string;
  @Field()
  @IsInt()
  change: number;
  @Field()
  reason: string;
  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}

@InputType()
export class AddVariantMediaInput {
  @Field()
  variantId: string;
  @Field({ nullable: true })
  @IsOptional()
  url?: string;
  @Field({ nullable: true })
  @IsOptional()
  base64?: string; // if provided, upload and use resulting URL
  @Field({ nullable: true })
  @IsOptional()
  filename?: string;
  @Field({ nullable: true })
  @IsOptional()
  contentType?: string;
  @Field({ nullable: true })
  @IsOptional()
  type?: string;
  @Field({ nullable: true })
  @IsOptional()
  position?: number;
}

@InputType()
export class AddProductMediaInput {
  @Field()
  productId: string;
  @Field({ nullable: true })
  @IsOptional()
  url?: string;
  @Field({ nullable: true })
  @IsOptional()
  base64?: string;
  @Field({ nullable: true })
  @IsOptional()
  filename?: string;
  @Field({ nullable: true })
  @IsOptional()
  contentType?: string;
  @Field({ nullable: true })
  @IsOptional()
  type?: string;
  @Field({ nullable: true })
  @IsOptional()
  position?: number;
}

@InputType()
export class BulkCreateVariantsInput {
  @Field()
  productId: string;
  @Field(() => [CreateVariantInput])
  variants: CreateVariantInput[];
}

@InputType()
export class CreateUserAddressInput {
  @Field()
  userId: string;
  @Field()
  type: string;
  @Field()
  addressLine1: string;
  @Field({ nullable: true })
  addressLine2?: string;
  @Field()
  city: string;
  @Field({ nullable: true })
  province?: string;
  @Field()
  country: string;
  @Field()
  postalCode: string;
}

@InputType()
export class UpdateUserAddressInput {
  @Field({ nullable: true })
  type?: string;
  @Field({ nullable: true })
  addressLine1?: string;
  @Field({ nullable: true })
  addressLine2?: string;
  @Field({ nullable: true })
  city?: string;
  @Field({ nullable: true })
  province?: string;
  @Field({ nullable: true })
  country?: string;
  @Field({ nullable: true })
  postalCode?: string;
}

@InputType()
export class CreateOrderItemInput {
  @Field()
  variant_id: string;
  @Field()
  @IsInt()
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field({ nullable: true })
  @IsOptional()
  userId?: string;
  @Field()
  email: string;
  @Field()
  first_name: string;
  @Field()
  last_name: string;
  @Field({ nullable: true })
  @IsOptional()
  phone?: string;
  @Field({ nullable: true })
  @IsOptional()
  mobile?: string;
  @Field(() => GraphQLJSONObject)
  shippingAddress: Record<string, any>;
  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  billingAddress?: Record<string, any>;
  @Field(() => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
  @Field({ nullable: true })
  @IsOptional()
  gift_card_code?: string;
  @Field({ nullable: true })
  @IsOptional()
  discount_code?: string;
}

@InputType()
export class UpdateOrderInput {
  @Field({ nullable: true })
  status?: string;
  @Field({ nullable: true })
  payment_status?: string;
  @Field(() => GraphQLJSONObject, { nullable: true })
  shippingAddress?: Record<string, any>;
  @Field(() => GraphQLJSONObject, { nullable: true })
  billingAddress?: Record<string, any>;
}

// Discounts
@InputType()
export class CreateDiscountInput {
  @Field({ nullable: true }) @IsOptional() code?: string;
  @Field({ nullable: true }) @IsOptional() title?: string;
  @Field({ nullable: true }) @IsOptional() description?: string;
  @Field() type: string;
  @Field({ nullable: true }) @IsOptional() method?: string;
  @Field({ nullable: true }) @IsOptional() vendor_id?: string;
  @Field({ nullable: true }) @IsOptional() amount_cents?: number;
  @Field({ nullable: true }) @IsOptional() percent?: number;
  @Field({ nullable: true }) @IsOptional() buy_x_quantity?: number;
  @Field({ nullable: true }) @IsOptional() get_y_quantity?: number;
  @Field({ nullable: true }) @IsOptional() min_purchase_amount_cents?: number;
  @Field({ nullable: true }) @IsOptional() min_quantity?: number;
  @Field({ nullable: true }) @IsOptional() usage_limit_total?: number;
  @Field({ nullable: true }) @IsOptional() usage_limit_per_customer?: number;
  @Field({ nullable: true }) @IsOptional() applies_to_all_products?: boolean;
  @Field({ nullable: true }) @IsOptional() combine_with_product?: boolean;
  @Field({ nullable: true }) @IsOptional() combine_with_order?: boolean;
  @Field({ nullable: true }) @IsOptional() combine_with_shipping?: boolean;
  @Field({ nullable: true }) @IsOptional() starts_at?: Date;
  @Field({ nullable: true }) @IsOptional() ends_at?: Date;
  @Field({ nullable: true }) @IsOptional() is_active?: boolean;
  @Field(() => [String], { nullable: true }) @IsOptional() shipping_countries?: string[];
  @Field(() => [String], { nullable: true }) @IsOptional() product_ids?: string[];
  @Field(() => [String], { nullable: true }) @IsOptional() category_ids?: string[];
}

@InputType()
export class UpdateDiscountInput {
  @Field({ nullable: true }) @IsOptional() code?: string;
  @Field({ nullable: true }) @IsOptional() title?: string;
  @Field({ nullable: true }) @IsOptional() description?: string;
  @Field({ nullable: true }) @IsOptional() type?: string;
  @Field({ nullable: true }) @IsOptional() method?: string;
  @Field({ nullable: true }) @IsOptional() vendor_id?: string;
  @Field({ nullable: true }) @IsOptional() amount_cents?: number;
  @Field({ nullable: true }) @IsOptional() percent?: number;
  @Field({ nullable: true }) @IsOptional() buy_x_quantity?: number;
  @Field({ nullable: true }) @IsOptional() get_y_quantity?: number;
  @Field({ nullable: true }) @IsOptional() min_purchase_amount_cents?: number;
  @Field({ nullable: true }) @IsOptional() min_quantity?: number;
  @Field({ nullable: true }) @IsOptional() usage_limit_total?: number;
  @Field({ nullable: true }) @IsOptional() usage_limit_per_customer?: number;
  @Field({ nullable: true }) @IsOptional() applies_to_all_products?: boolean;
  @Field({ nullable: true }) @IsOptional() combine_with_product?: boolean;
  @Field({ nullable: true }) @IsOptional() combine_with_order?: boolean;
  @Field({ nullable: true }) @IsOptional() combine_with_shipping?: boolean;
  @Field({ nullable: true }) @IsOptional() starts_at?: Date;
  @Field({ nullable: true }) @IsOptional() ends_at?: Date;
  @Field({ nullable: true }) @IsOptional() is_active?: boolean;
  @Field(() => [String], { nullable: true }) @IsOptional() shipping_countries?: string[];
  @Field(() => [String], { nullable: true }) @IsOptional() product_ids?: string[];
  @Field(() => [String], { nullable: true }) @IsOptional() category_ids?: string[];
}

@InputType()
export class CreateCollectionInput {
  @Field() vendor_id: string;
  @Field() name: string;
  @Field({ nullable: true }) @IsOptional() description?: string;
  @Field({ nullable: true }) @IsOptional() image?: string;
  @Field({ nullable: true }) @IsOptional() imageBase64?: string;
  @Field({ nullable: true }) @IsOptional() imageFilename?: string;
  @Field({ nullable: true }) @IsOptional() imageContentType?: string;
}

@InputType()
export class UpdateCollectionInput {
  @Field({ nullable: true }) @IsOptional() name?: string;
  @Field({ nullable: true }) @IsOptional() description?: string;
  @Field({ nullable: true }) @IsOptional() image?: string;
  @Field({ nullable: true }) @IsOptional() imageBase64?: string;
  @Field({ nullable: true }) @IsOptional() imageFilename?: string;
  @Field({ nullable: true }) @IsOptional() imageContentType?: string;
  @Field({ nullable: true }) @IsOptional() is_active?: boolean;
}

@InputType()
export class ModifyCollectionProductsInput {
  @Field() collection_id: string;
  @Field(() => [String]) product_ids: string[];
}

@InputType()
export class UpdateVendorNotificationSettingsInput {
  @Field({ nullable: true }) email_notifications_enabled?: boolean;
  @Field({ nullable: true }) order_new?: boolean;
  @Field({ nullable: true }) order_paid?: boolean;
  @Field({ nullable: true }) order_cancelled?: boolean;
  @Field({ nullable: true }) order_refunded?: boolean;
  @Field({ nullable: true }) return_requested?: boolean;
  @Field({ nullable: true }) low_stock?: boolean;
  @Field({ nullable: true }) low_stock_threshold?: number;
  @Field({ nullable: true }) product_status_change?: boolean;
  @Field({ nullable: true }) review_received?: boolean;
  @Field({ nullable: true }) payout_sent?: boolean;
  @Field({ nullable: true }) message_received?: boolean;
}

@InputType()
export class CreateGiftCardInput {
  @Field() code: string;
  @Field() @IsInt() @Min(0) initial_value_cents: number;
  @Field({ nullable: true }) @IsOptional() expires_at?: Date;
  @Field({ nullable: true }) @IsOptional() notes?: string;
  @Field({ nullable: true }) @IsOptional() status?: string; // ACTIVE | INACTIVE
  @Field({ nullable: true }) @IsOptional() customer_id?: string;
  @Field({ nullable: true }) @IsOptional() image?: string;
  @Field({ nullable: true }) @IsOptional() imageBase64?: string;
  @Field({ nullable: true }) @IsOptional() imageFilename?: string;
  @Field({ nullable: true }) @IsOptional() imageContentType?: string;
}

@InputType()
export class UpdateGiftCardInput {
  @Field({ nullable: true }) @IsOptional() code?: string;
  @Field({ nullable: true }) @IsOptional() @IsInt() initial_value_cents?: number;
  @Field({ nullable: true }) @IsOptional() @IsInt() balance_cents?: number;
  @Field({ nullable: true }) @IsOptional() expires_at?: Date;
  @Field({ nullable: true }) @IsOptional() notes?: string;
  @Field({ nullable: true }) @IsOptional() status?: string;
  @Field({ nullable: true }) @IsOptional() customer_id?: string;
  @Field({ nullable: true }) @IsOptional() image?: string;
  @Field({ nullable: true }) @IsOptional() imageBase64?: string;
  @Field({ nullable: true }) @IsOptional() imageFilename?: string;
  @Field({ nullable: true }) @IsOptional() imageContentType?: string;
}

@InputType()
export class ReturnOrderItemInput {
  @Field()
  order_item_id: string;
  @Field()
  @IsInt()
  @Min(1)
  quantity: number;
  @Field()
  reason: string;
  @Field()
  condition: string;
  @Field({ nullable: true })
  @IsOptional()
  description?: string;
}

@InputType()
export class RequestReturnInput {
  @Field()
  orderId: string;
  @Field(() => [ReturnOrderItemInput])
  items: ReturnOrderItemInput[];
  @Field()
  return_method: string;
  @Field()
  refund_method: string;
  @Field({ nullable: true })
  @IsOptional()
  reason?: string;
}

@InputType()
export class WishlistItemInput {
  @Field()
  product_id: string;
  @Field({ nullable: true })
  product_variant_id?: string;
}

@InputType()
export class CreateReviewInput {
  @Field()
  product_id: string;
  @Field()
  @IsInt()
  rating: number;
  @Field()
  comment: string;
}

@InputType()
export class UpdateReviewInput {
  @Field()
  product_id: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  rating?: number;
  @Field({ nullable: true })
  @IsOptional()
  comment?: string;
}

@InputType()
export class UpdateNotificationSettingsInput {
  @Field({ nullable: true }) order_confirmations?: boolean;
  @Field({ nullable: true }) shipping_updates?: boolean;
  @Field({ nullable: true }) delivery_notifications?: boolean;
  @Field({ nullable: true }) product_recommendations?: boolean;
  @Field({ nullable: true }) exclusive_deals?: boolean;
  @Field({ nullable: true }) wishlist_updates?: boolean;
  @Field({ nullable: true }) shopping_insights?: boolean;
  @Field({ nullable: true }) login_alerts?: boolean;
  @Field({ nullable: true }) password_changes?: boolean;
}

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true }) first_name?: string;
  @Field({ nullable: true }) last_name?: string;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) phone?: string;
  @Field({ nullable: true }) date_of_birth?: Date;
}

@InputType()
export class UpdatePasswordInput {
  @Field() current_password: string;
  @Field() new_password: string;
}

@InputType()
export class CreateProductOptionInput {
  @Field()
  productId: string;
  @Field()
  name: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  position?: number;
}

@InputType()
export class AddOptionValueInput {
  @Field()
  optionId: string;
  @Field()
  value: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  position?: number;
}

@InputType()
export class MediaUploadInput {
  @Field()
  base64: string;
  @Field()
  filename: string;
  @Field({ nullable: true })
  @IsOptional()
  contentType?: string;
  @Field({ nullable: true })
  @IsOptional()
  type?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  position?: number;
}


