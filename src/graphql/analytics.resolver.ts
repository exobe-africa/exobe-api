import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AnalyticsService } from '../analytics/analytics.service';
import { RecordAnalyticsEventInput } from './dto/analytics.inputs';
import { AnalyticsEventType, UserEngagementStatsType } from './types/analytics.types';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver()
export class AnalyticsResolver {
  constructor(private analytics: AnalyticsService) {}

  @Mutation(() => String)
  async recordAnalyticsEvent(
    @Args('input') input: RecordAnalyticsEventInput,
    @Args('anonymous', { type: () => Boolean, nullable: true }) anonymous?: boolean,
  ) {
    const created = await this.analytics.recordEvent({
      userId: input.userId,
      sessionId: input.sessionId,
      eventType: input.eventType,
      pagePath: input.pagePath,
      pageTitle: input.pageTitle,
      referrer: input.referrer,
      productId: input.productId,
      collectionId: input.collectionId,
      vendorId: input.vendorId,
      searchQuery: input.searchQuery,
      durationMs: input.durationMs ?? undefined,
      scrollDepth: input.scrollDepth ?? undefined,
      attributes: input.attributes ?? null,
      userAgent: input.userAgent,
      ip: input.ip,
      isNewSession: input.isNewSession ?? false,
      occurredAt: input.occurredAt,
    });
    return created?.id ?? '';
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserEngagementStatsType, { nullable: true })
  async myEngagementStats(@CurrentUser() user: any) {
    return this.analytics.getUserStats(user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [AnalyticsEventType])
  async myRecentEvents(
    @CurrentUser() user: any,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.analytics.getRecentEvents(user.userId, limit ?? 20);
  }
}


