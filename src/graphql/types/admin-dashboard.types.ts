import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DashboardStatsType {
  @Field(() => Float)
  totalUsers: number;

  @Field(() => Float)
  usersTrend: number;

  @Field(() => Float)
  activeVendors: number;

  @Field(() => Float)
  vendorsTrend: number;

  @Field(() => Float)
  totalProducts: number;

  @Field(() => Float)
  productsTrend: number;

  @Field(() => Float)
  totalOrders: number;

  @Field(() => Float)
  ordersTrend: number;

  @Field(() => Float)
  revenueCents: number;

  @Field(() => Float)
  revenueTrend: number;

  @Field(() => Float)
  growthRate: number;
}

@ObjectType()
export class RecentOrderType {
  @Field()
  id: string;

  @Field()
  order_number: string;

  @Field()
  customer: string;

  @Field(() => Float)
  amount_cents: number;

  @Field()
  status: string;

  @Field(() => Float)
  items_count: number;

  @Field()
  payment_status: string;

  @Field()
  date: string;
}

