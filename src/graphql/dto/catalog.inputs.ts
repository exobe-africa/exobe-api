import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

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


