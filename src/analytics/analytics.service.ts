import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface RecordEventParams {
  userId?: string;
  sessionId?: string;
  eventType: string;
  pagePath?: string;
  pageTitle?: string;
  referrer?: string;
  productId?: string;
  collectionId?: string;
  vendorId?: string;
  searchQuery?: string;
  durationMs?: number;
  scrollDepth?: number;
  attributes?: Record<string, any> | null;
  userAgent?: string;
  ip?: string;
  isNewSession?: boolean;
  occurredAt?: Date;
}

function startOfUtcDay(date: Date): Date {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
}

function daysBetweenUtc(a: Date, b: Date): number {
  const ms = startOfUtcDay(b).getTime() - startOfUtcDay(a).getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async recordEvent(params: RecordEventParams): Promise<{ id: string } | null> {
    const now = params.occurredAt ? new Date(params.occurredAt) : new Date();
    const created = await this.prisma.analyticsEvent.create({
      data: {
        user_id: params.userId ?? null,
        session_id: params.sessionId ?? null,
        event_type: params.eventType,
        page_path: params.pagePath ?? null,
        page_title: params.pageTitle ?? null,
        referrer: params.referrer ?? null,
        product_id: params.productId ?? null,
        collection_id: params.collectionId ?? null,
        vendor_id: params.vendorId ?? null,
        search_query: params.searchQuery ?? null,
        duration_ms: params.durationMs ?? null,
        scroll_depth: params.scrollDepth ?? null,
        attributes: params.attributes ?? null,
        user_agent: params.userAgent ?? null,
        ip: params.ip ?? null,
        created_at: now,
      },
      select: { id: true },
    });

    if (params.userId) {
      await this.updateDailyStatsAndStreak(params.userId, now, Boolean(params.isNewSession));
    }

    return created;
  }

  async updateDailyStatsAndStreak(userId: string, at: Date, isNewSession: boolean): Promise<void> {
    const day = startOfUtcDay(at);

    // Upsert daily activity
    await this.prisma.userDailyActive.upsert({
      where: { user_id_date: { user_id: userId, date: day } },
      update: {
        event_count: { increment: 1 },
        ...(isNewSession ? { session_count: { increment: 1 } } : {}),
      },
      create: {
        user_id: userId,
        date: day,
        session_count: isNewSession ? 1 : 0,
        event_count: 1,
      },
    });

    const stats = await this.prisma.userEngagementStats.findUnique({ where: { user_id: userId } });
    if (!stats) {
      await this.prisma.userEngagementStats.create({
        data: {
          user_id: userId,
          first_active_date: day,
          last_active_date: day,
          days_active_count: 1,
          current_streak_days: 1,
          longest_streak_days: 1,
        },
      });
      return;
    }

    const deltaDays = daysBetweenUtc(stats.last_active_date, day);
    if (deltaDays === 0) {
      // Same day, do not change streak or days_active_count
      return;
    }

    if (deltaDays === 1) {
      const nextCurrent = stats.current_streak_days + 1;
      const nextLongest = Math.max(stats.longest_streak_days, nextCurrent);
      await this.prisma.userEngagementStats.update({
        where: { user_id: userId },
        data: {
          last_active_date: day,
          days_active_count: { increment: 1 },
          current_streak_days: nextCurrent,
          longest_streak_days: nextLongest,
        },
      });
      return;
    }

    // Gap > 1 day: reset current streak to 1
    await this.prisma.userEngagementStats.update({
      where: { user_id: userId },
      data: {
        last_active_date: day,
        days_active_count: { increment: 1 },
        current_streak_days: 1,
      },
    });
  }

  async getUserStats(userId: string) {
    return this.prisma.userEngagementStats.findUnique({ where: { user_id: userId } });
  }

  async getRecentEvents(userId: string, limit = 20) {
    return this.prisma.analyticsEvent.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: Math.min(Math.max(limit, 1), 100),
    });
  }
}


