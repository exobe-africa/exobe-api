import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const totalUsers = await (this.prisma as any).user.count();
    const usersLastMonth = await (this.prisma as any).user.count({
      where: { created_at: { gte: thirtyDaysAgo } },
    });
    const usersPreviousMonth = await (this.prisma as any).user.count({
      where: { 
        created_at: { 
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo 
        } 
      },
    });
    const usersTrend = usersPreviousMonth > 0 
      ? ((usersLastMonth - usersPreviousMonth) / usersPreviousMonth) * 100 
      : usersLastMonth > 0 ? 100 : 0;

    // Active vendors and trend
    const activeVendors = await (this.prisma as any).vendor.count({
      where: { status: 'APPROVED' }
    });
    const vendorsLastMonth = await (this.prisma as any).vendor.count({
      where: { 
        status: 'APPROVED',
        created_at: { gte: thirtyDaysAgo } 
      },
    });
    const vendorsPreviousMonth = await (this.prisma as any).vendor.count({
      where: { 
        status: 'APPROVED',
        created_at: { 
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo 
        } 
      },
    });
    const vendorsTrend = vendorsPreviousMonth > 0 
      ? ((vendorsLastMonth - vendorsPreviousMonth) / vendorsPreviousMonth) * 100 
      : vendorsLastMonth > 0 ? 100 : 0;

    // Total products and trend – treat a product as active if status = ACTIVE OR is_active = true
    const activeProductWhere: any = { OR: [ { status: 'ACTIVE' }, { is_active: true } ] };
    const totalProducts = await (this.prisma as any).catalogProduct.count({ where: activeProductWhere });
    const productsLastMonth = await (this.prisma as any).catalogProduct.count({
      where: { ...activeProductWhere, created_at: { gte: thirtyDaysAgo } },
    });
    const productsPreviousMonth = await (this.prisma as any).catalogProduct.count({
      where: { ...activeProductWhere, created_at: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
    });
    const productsTrend = productsPreviousMonth > 0 
      ? ((productsLastMonth - productsPreviousMonth) / productsPreviousMonth) * 100 
      : productsLastMonth > 0 ? 100 : 0;

    // Total orders and trend
    const totalOrders = await (this.prisma as any).order.count();
    const ordersLastMonth = await (this.prisma as any).order.count({
      where: { created_at: { gte: thirtyDaysAgo } },
    });
    const ordersPreviousMonth = await (this.prisma as any).order.count({
      where: { 
        created_at: { 
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo 
        } 
      },
    });
    const ordersTrend = ordersPreviousMonth > 0 
      ? ((ordersLastMonth - ordersPreviousMonth) / ordersPreviousMonth) * 100 
      : ordersLastMonth > 0 ? 100 : 0;

    // Revenue and trend
    const revenueResult = await (this.prisma as any).order.aggregate({
      where: { payment_status: 'PAID' },
      _sum: { total_cents: true },
    });
    const revenueCents = revenueResult._sum.total_cents || 0;

    const revenueLastMonth = await (this.prisma as any).order.aggregate({
      where: { 
        payment_status: 'PAID',
        created_at: { gte: thirtyDaysAgo } 
      },
      _sum: { total_cents: true },
    });
    const revenuePreviousMonth = await (this.prisma as any).order.aggregate({
      where: { 
        payment_status: 'PAID',
        created_at: { 
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo 
        } 
      },
      _sum: { total_cents: true },
    });
    const revenueLastMonthValue = revenueLastMonth._sum.total_cents || 0;
    const revenuePreviousMonthValue = revenuePreviousMonth._sum.total_cents || 0;
    const revenueTrend = revenuePreviousMonthValue > 0 
      ? ((revenueLastMonthValue - revenuePreviousMonthValue) / revenuePreviousMonthValue) * 100 
      : revenueLastMonthValue > 0 ? 100 : 0;

    // Growth rate (average of all trends)
    const growthRate = (usersTrend + vendorsTrend + productsTrend + ordersTrend + revenueTrend) / 5;

    return {
      totalUsers,
      usersTrend,
      activeVendors,
      vendorsTrend,
      totalProducts,
      productsTrend,
      totalOrders,
      ordersTrend,
      revenueCents,
      revenueTrend,
      growthRate,
    };
  }

  async getRecentOrders(limit: number = 5) {
    const orders = await (this.prisma as any).order.findMany({
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        items: true,
        customer: {
          select: { 
            user: {
              select: { email: true }
            }
          }
        }
      },
    });

    return orders.map((order: any) => ({
      id: order.id,
      order_number: order.order_number,
      customer: order.customer?.user?.email || order.email || 'Guest',
      amount_cents: order.total_cents,
      status: order.status,
      items_count: order.items?.length || 0,
      payment_status: order.payment_status,
      date: order.created_at.toISOString().split('T')[0],
    }));
  }
}

