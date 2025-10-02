import { Field, ID, ObjectType } from '@nestjs/graphql';

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
  @Field(() => String)
  attributes: any;
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


