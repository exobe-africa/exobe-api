import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductStatsType {
  @Field(() => Float)
  total: number;

  @Field(() => Float)
  active: number;

  @Field(() => Float)
  draft: number;

  @Field(() => Float)
  outOfStock: number;

  // Categories derived from products (not the categories table)
  @Field(() => Float, { nullable: true })
  categoriesTotal?: number;
  @Field(() => Float, { nullable: true })
  categoriesActive?: number;
  @Field(() => Float, { nullable: true })
  categoriesInactive?: number;
  @Field(() => Float, { nullable: true })
  categoriesDraft?: number;
}

