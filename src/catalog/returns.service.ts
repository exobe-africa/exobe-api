import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VendorNotificationsService } from './vendor-notifications.service';

@Injectable()
export class ReturnsService {
  constructor(private prisma: PrismaService, private vendorNotifs: VendorNotificationsService) {}

  async requestReturn(params: {
    userId: string;
    orderId: string;
    items: Array<{ order_item_id: string; quantity: number; reason: string; condition: string; description?: string }>;
    return_method: 'PICKUP' | 'DROPOFF';
    refund_method: 'ORIGINAL' | 'STORE_CREDIT';
    reason?: string;
  }) {
    const customer = await (this.prisma as any).customer.findFirst({ where: { user_id: params.userId } });
    if (!customer) throw new ForbiddenException('No customer profile');
    const order = await (this.prisma as any).order.findUnique({ where: { id: params.orderId }, include: { items: true } });
    if (!order || order.customer_id !== customer.id) throw new ForbiddenException('Order not found');

    const itemsMap = new Map(order.items.map((i: any) => [i.id, i]));
    const preparedItems = params.items.map((it) => {
      const oi = itemsMap.get(it.order_item_id) as any;
      if (!oi) throw new NotFoundException('Order item not found');
      const qty = Math.max(1, Math.min(it.quantity, oi?.quantity ?? 0));
      const refund_cents = qty * (oi?.price_cents ?? 0);
      return { order_item_id: it.order_item_id, quantity: qty, reason: it.reason, condition: it.condition, description: it.description, refund_cents };
    });
    const total_refund_cents = preparedItems.reduce((s, i) => s + i.refund_cents, 0);

    const rr = await this.prisma.$transaction(async (tx) => {
      const created = await (tx as any).returnRequest.create({
        data: {
          order_id: order.id,
          customer_id: customer.id,
          status: 'REQUESTED',
          return_method: params.return_method,
          refund_method: params.refund_method,
          reason: params.reason,
          total_refund_cents,
          items: { create: preparedItems },
          events: { create: [{ status: 'REQUESTED', description: 'Return requested by customer' }] },
        },
        include: { items: true, events: true },
      });
      return created;
    });
    // Notify vendors of return request
    try { await this.vendorNotifs.sendReturnRequestEmail(rr); } catch {}
    return rr;
  }

  async myReturns(userId: string) {
    const customer = await (this.prisma as any).customer.findFirst({ where: { user_id: userId } });
    if (!customer) return [];
    return (this.prisma as any).returnRequest.findMany({
      where: { customer_id: customer.id },
      include: { items: true, events: true, order: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async returnById(id: string, userId: string, isAdmin: boolean) {
    const ret = await (this.prisma as any).returnRequest.findUnique({ where: { id }, include: { items: true, events: true, order: true } });
    if (!ret) throw new NotFoundException('Return not found');
    if (isAdmin) return ret;
    const customer = await (this.prisma as any).customer.findFirst({ where: { user_id: userId } });
    if (customer && ret.customer_id === customer.id) return ret;
    throw new NotFoundException('Return not found');
  }

  async updateReturnStatus(id: string, status: string, description?: string) {
    const ret = await (this.prisma as any).returnRequest.findUnique({ where: { id } });
    if (!ret) throw new NotFoundException('Return not found');
    const updated = await (this.prisma as any).returnRequest.update({ where: { id }, data: { status } });
    await (this.prisma as any).returnEvent.create({ data: { return_request_id: id, status, description } });
    return updated;
  }
}


