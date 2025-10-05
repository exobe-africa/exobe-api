import { Field, InputType, Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class RecordAnalyticsEventInput {
  @Field({ nullable: true }) userId?: string;
  @Field({ nullable: true }) sessionId?: string;
  @Field() eventType: string;
  @Field({ nullable: true }) pagePath?: string;
  @Field({ nullable: true }) pageTitle?: string;
  @Field({ nullable: true }) referrer?: string;
  @Field({ nullable: true }) productId?: string;
  @Field({ nullable: true }) collectionId?: string;
  @Field({ nullable: true }) vendorId?: string;
  @Field({ nullable: true }) searchQuery?: string;
  @Field(() => Int, { nullable: true }) durationMs?: number;
  @Field(() => Int, { nullable: true }) scrollDepth?: number;
  @Field(() => GraphQLJSONObject, { nullable: true }) attributes?: Record<string, any>;
  @Field({ nullable: true }) userAgent?: string;
  @Field({ nullable: true }) ip?: string;
  @Field({ nullable: true }) isNewSession?: boolean;
  @Field({ nullable: true }) occurredAt?: Date;
}


