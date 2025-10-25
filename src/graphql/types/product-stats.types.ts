import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductStatsType {
  @Field(() => Float)
  total: number;

  @Field(() => Float)
  active: number;

  @Field(() => Float)
  lowStock: number;

  @Field(() => Float)
  outOfStock: number;
}

