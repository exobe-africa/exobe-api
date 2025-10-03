import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  private async userPurchasedProduct(userId: string, productId: string) {
    const customer = await (this.prisma as any).customer.findFirst({ where: { user_id: userId } });
    if (!customer) return false;
    const order = await (this.prisma as any).order.findFirst({
      where: {
        customer_id: customer.id,
        status: 'FULFILLED',
        items: { some: { product_id: productId } },
      },
      select: { id: true },
    });
    return !!order;
  }

  async createReview(userId: string, input: { product_id: string; rating: number; comment: string }) {
    const ok = await this.userPurchasedProduct(userId, input.product_id);
    if (!ok) throw new ForbiddenException('You must have purchased and received this product');
    return (this.prisma as any).review.create({ data: { user_id: userId, product_id: input.product_id, rating: input.rating, comment: input.comment } });
  }

  async updateReview(userId: string, input: { product_id: string; rating?: number; comment?: string }) {
    const existing = await (this.prisma as any).review.findUnique({ where: { product_id_user_id: { product_id: input.product_id, user_id: userId } } });
    if (!existing) throw new NotFoundException('Review not found');
    return (this.prisma as any).review.update({
      where: { product_id_user_id: { product_id: input.product_id, user_id: userId } },
      data: { rating: input.rating ?? existing.rating, comment: input.comment ?? existing.comment },
    });
  }

  async deleteReview(userId: string, product_id: string) {
    const existing = await (this.prisma as any).review.findUnique({ where: { product_id_user_id: { product_id, user_id: userId } } });
    if (!existing) return true;
    await (this.prisma as any).review.delete({ where: { product_id_user_id: { product_id, user_id: userId } } });
    return true;
  }

  async productReviews(product_id: string) {
    return (this.prisma as any).review.findMany({ where: { product_id }, orderBy: { created_at: 'desc' } });
  }

  async myReviews(userId: string) {
    return (this.prisma as any).review.findMany({ where: { user_id: userId }, orderBy: { created_at: 'desc' } });
  }
}


