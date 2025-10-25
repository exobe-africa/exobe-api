import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class VendorStatsType {
  @Field(() => Float)
  total: number;

  @Field(() => Float)
  active: number;

  @Field(() => Float)
  pending: number;

  @Field(() => Float)
  suspended: number;

  @Field(() => Float)
  totalProducts: number;
}

