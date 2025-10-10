import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class VendorType {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
  @Field()
  slug: string;
  @Field({ nullable: true })
  description?: string;
  @Field()
  isActive: boolean;
}

@ObjectType()
export class CategoryType {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
  @Field()
  slug: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  parentId?: string;
  @Field()
  path: string;
  @Field()
  isActive: boolean;
}

@ObjectType()
export class ProductMediaType {
  @Field(() => ID)
  id: string;
  @Field()
  url: string;
  @Field()
  type: string;
  @Field()
  position: number;
}

@ObjectType()
export class ProductVariantType {
  @Field(() => ID)
  id: string;
  @Field()
  sku: string;
  @Field()
  title: string;
  @Field()
  priceCents: number;
  @Field({ nullable: true })
  compareAtPriceCents?: number;
  @Field({ nullable: true })
  barcode?: string;
  @Field({ nullable: true })
  weightGrams?: number;
  @Field()
  stockQuantity: number;
  @Field(() => GraphQLJSONObject)
  attributes: Record<string, any>;
  @Field(() => [String], { nullable: true })
  availableLocations?: string[];
  @Field(() => [ProductMediaType], { nullable: true })
  media?: ProductMediaType[];
}

@ObjectType()
export class ProductType {
  @Field(() => ID)
  id: string;
  @Field()
  vendorId: string;
  @Field()
  categoryId: string;
  @Field()
  title: string;
  @Field()
  slug: string;
  @Field({ nullable: true })
  description?: string;
  @Field()
  status: string;
  @Field()
  isActive: boolean;
  @Field()
  featured: boolean;
  @Field(() => [String], { nullable: true })
  features?: string[];
  @Field(() => [String], { nullable: true })
  availableLocations?: string[];
}

@ObjectType()
export class ProductOptionValueType {
  @Field(() => ID)
  id: string;
  @Field()
  value: string;
  @Field()
  position: number;
}

@ObjectType()
export class ProductOptionType {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
  @Field()
  position: number;
  @Field(() => [ProductOptionValueType])
  values: ProductOptionValueType[];
}

@ObjectType()
export class CategoryTreeType {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
  @Field()
  slug: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  parentId?: string;
  @Field()
  path: string;
  @Field()
  isActive: boolean;
  @Field(() => [CategoryTreeType])
  children: CategoryTreeType[];
}

@ObjectType()
export class UserAddressType {
  @Field(() => ID)
  id: string;
  @Field()
  type: string;
  @Field()
  addressName: string;
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
  @Field()
  defaultAddress: boolean;
}

@ObjectType()
export class OrderItemType {
  @Field(() => ID)
  id: string;
  @Field()
  sku: string;
  @Field()
  title: string;
  @Field(() => GraphQLJSONObject)
  attributes: Record<string, any>;
  @Field()
  price_cents: number;
  @Field()
  quantity: number;
  @Field()
  total_cents: number;
}

@ObjectType()
export class OrderType {
  @Field(() => ID)
  id: string;
  @Field()
  order_number: string;
  @Field()
  email: string;
  @Field()
  status: string;
  @Field()
  payment_status: string;
  @Field()
  subtotal_cents: number;
  @Field()
  shipping_cents: number;
  @Field()
  vat_cents: number;
  @Field()
  total_cents: number;
  @Field({ nullable: true })
  gift_card_code?: string;
  @Field({ nullable: true })
  gift_card_amount_cents?: number;
  @Field({ nullable: true })
  invoice_url?: string;
  @Field({ nullable: true })
  receipt_url?: string;
  @Field(() => GraphQLJSONObject)
  shipping_address: Record<string, any>;
  @Field(() => GraphQLJSONObject)
  billing_address: Record<string, any>;
  @Field(() => [OrderItemType])
  items: OrderItemType[];
  @Field(() => [OrderEventType], { nullable: true })
  events?: OrderEventType[];
  @Field({ nullable: true })
  discount_total_cents?: number;
}

@ObjectType()
export class DiscountTypeGQL {
  @Field(() => ID)
  id: string;
  @Field({ nullable: true }) code?: string;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) description?: string;
  @Field() type: string;
  @Field() method: string;
  @Field({ nullable: true }) vendor_id?: string;
  @Field({ nullable: true }) amount_cents?: number;
  @Field({ nullable: true }) percent?: number;
  @Field({ nullable: true }) buy_x_quantity?: number;
  @Field({ nullable: true }) get_y_quantity?: number;
  @Field({ nullable: true }) min_purchase_amount_cents?: number;
  @Field({ nullable: true }) min_quantity?: number;
  @Field({ nullable: true }) usage_limit_total?: number;
  @Field({ nullable: true }) usage_limit_per_customer?: number;
  @Field({ nullable: true }) applies_to_all_products?: boolean;
  @Field({ nullable: true }) combine_with_product?: boolean;
  @Field({ nullable: true }) combine_with_order?: boolean;
  @Field({ nullable: true }) combine_with_shipping?: boolean;
  @Field({ nullable: true }) starts_at?: Date;
  @Field({ nullable: true }) ends_at?: Date;
  @Field() is_active: boolean;
}

@ObjectType()
export class CollectionType {
  @Field(() => ID)
  id: string;
  @Field() vendor_id: string;
  @Field() name: string;
  @Field() slug: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) image?: string;
  @Field() is_active: boolean;
}

@ObjectType()
export class GiftCardType {
  @Field(() => ID)
  id: string;
  @Field()
  code: string;
  @Field({ nullable: true })
  customer_id?: string;
  @Field()
  initial_value_cents: number;
  @Field()
  balance_cents: number;
  @Field()
  status: string;
  @Field({ nullable: true })
  notes?: string;
  @Field({ nullable: true })
  expires_at?: Date;
}

@ObjectType()
export class OrderEventType {
  @Field(() => ID)
  id: string;
  @Field({ nullable: true })
  status?: string;
  @Field({ nullable: true })
  payment_status?: string;
  @Field({ nullable: true })
  description?: string;
  @Field()
  created_at: Date;
}

@ObjectType()
export class WishlistItemType {
  @Field(() => ID)
  id: string;
  @Field()
  product_id: string;
  @Field({ nullable: true })
  product_variant_id?: string;
  @Field()
  created_at: string;
}

@ObjectType()
export class WishlistType {
  @Field(() => ID)
  id: string;
  @Field(() => [WishlistItemType])
  items: WishlistItemType[];
}

@ObjectType()
export class ReviewType {
  @Field(() => ID)
  id: string;
  @Field()
  product_id: string;
  @Field()
  user_id: string;
  @Field()
  rating: number;
  @Field()
  comment: string;
  @Field()
  created_at: Date;
  @Field()
  updated_at: Date;
}

@ObjectType()
export class CustomerNotificationSettingsType {
  @Field(() => ID)
  id: string;
  @Field()
  order_confirmations: boolean;
  @Field()
  shipping_updates: boolean;
  @Field()
  delivery_notifications: boolean;
  @Field()
  product_recommendations: boolean;
  @Field()
  exclusive_deals: boolean;
  @Field()
  wishlist_updates: boolean;
  @Field()
  shopping_insights: boolean;
  @Field()
  login_alerts: boolean;
  @Field()
  password_changes: boolean;
}

@ObjectType()
export class VatRateType {
  @Field(() => ID)
  id: string;
  @Field()
  country: string;
  @Field({ nullable: true })
  province?: string;
  @Field()
  rate: number;
  @Field()
  is_active: boolean;
}

@ObjectType()
export class VendorNotificationSettingsType {
  @Field(() => ID)
  id: string;
  @Field()
  vendor_id: string;
  @Field()
  email_notifications_enabled: boolean;
  @Field()
  order_new: boolean;
  @Field()
  order_paid: boolean;
  @Field()
  order_cancelled: boolean;
  @Field()
  order_refunded: boolean;
  @Field()
  return_requested: boolean;
  @Field()
  low_stock: boolean;
  @Field()
  low_stock_threshold: number;
  @Field()
  product_status_change: boolean;
  @Field()
  review_received: boolean;
  @Field()
  payout_sent: boolean;
  @Field()
  message_received: boolean;
}

@ObjectType()
export class ReturnEventType {
  @Field(() => ID)
  id: string;
  @Field()
  status: string;
  @Field({ nullable: true })
  description?: string;
  @Field()
  created_at: Date;
}

@ObjectType()
export class ReturnItemType {
  @Field(() => ID)
  id: string;
  @Field()
  order_item_id: string;
  @Field()
  quantity: number;
  @Field()
  reason: string;
  @Field()
  condition: string;
  @Field({ nullable: true })
  description?: string;
  @Field()
  refund_cents: number;
}

@ObjectType()
export class ReturnRequestType {
  @Field(() => ID)
  id: string;
  @Field()
  order_id: string;
  @Field()
  status: string;
  @Field()
  return_method: string;
  @Field()
  refund_method: string;
  @Field({ nullable: true })
  reason?: string;
  @Field()
  total_refund_cents: number;
  @Field(() => [ReturnItemType])
  items: ReturnItemType[];
  @Field(() => [ReturnEventType])
  events: ReturnEventType[];
}


