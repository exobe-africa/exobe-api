import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class AnalyticsEventType {
  @Field(() => ID)
  id: string;
  @Field({ nullable: true }) user_id?: string;
  @Field({ nullable: true }) session_id?: string;
  @Field() event_type: string;
  @Field({ nullable: true }) page_path?: string;
  @Field({ nullable: true }) page_title?: string;
  @Field({ nullable: true }) referrer?: string;
  @Field({ nullable: true }) product_id?: string;
  @Field({ nullable: true }) collection_id?: string;
  @Field({ nullable: true }) vendor_id?: string;
  @Field({ nullable: true }) search_query?: string;
  @Field({ nullable: true }) duration_ms?: number;
  @Field({ nullable: true }) scroll_depth?: number;
  @Field(() => GraphQLJSONObject, { nullable: true }) attributes?: Record<string, any>;
  @Field({ nullable: true }) user_agent?: string;
  @Field({ nullable: true }) ip?: string;
  @Field() created_at: Date;
}

@ObjectType()
export class UserEngagementStatsType {
  @Field(() => ID)
  id: string;
  @Field() user_id: string;
  @Field() first_active_date: Date;
  @Field() last_active_date: Date;
  @Field() days_active_count: number;
  @Field() current_streak_days: number;
  @Field() longest_streak_days: number;
  @Field() created_at: Date;
  @Field() updated_at: Date;
}


