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
  @Field()
  url: string;
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
  @Field()
  url: string;
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
  return_method: string; // 'PICKUP' | 'DROPOFF'
  @Field()
  refund_method: string; // 'ORIGINAL' | 'STORE_CREDIT'
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


