import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNumber() {
    return `EX-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  async ensureCustomerForUserOrGuest(input: {
    userId?: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    mobile?: string;
    shippingAddress: any;
    billingAddress?: any;
  }) {
    if (input.userId) {
      let customer = await (this.prisma as any).customer.findFirst({ where: { user_id: input.userId } });
      if (!customer) {
        customer = await (this.prisma as any).customer.create({
          data: {
            user_id: input.userId,
            email: input.email,
            first_name: input.first_name,
            last_name: input.last_name,
            phone: input.phone,
            mobile: input.mobile,
          },
        });
      }
      return customer;
    }
    return (this.prisma as any).customer.create({
      data: {
        email: input.email,
        first_name: input.first_name,
        last_name: input.last_name,
        phone: input.phone,
        mobile: input.mobile,
      },
    });
  }

  private async getVatRate(country: string, province?: string): Promise<number> {
    const vatRate = await this.prisma.vatRate.findFirst({
      where: {
        country,
        province: province || null,
        is_active: true,
      },
      orderBy: { created_at: 'desc' },
    });
    return vatRate?.rate || 0.15; // Default to 15% if no rate found
  }

  async createOrder(params: {
    userId?: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    mobile?: string;
    shippingAddress: any;
    billingAddress?: any;
    items: Array<{ variant_id: string; quantity: number }>;
  }) {
    const customer = await this.ensureCustomerForUserOrGuest(params);
    const variants = await this.prisma.productVariant.findMany({ where: { id: { in: params.items.map(i => i.variant_id) } } });
    if (variants.length !== params.items.length) throw new NotFoundException('One or more variants not found');

    const items = params.items.map(i => {
      const v = variants.find(x => x.id === i.variant_id)!;
      return {
        product_variant_id: v.id,
        product_id: v.product_id,
        vendor_id: undefined as any,
        sku: v.sku,
        title: v.title,
        attributes: v.attributes as any,
        price_cents: v.price_cents,
        quantity: i.quantity,
        total_cents: v.price_cents * i.quantity,
      };
    });

    const products = await this.prisma.catalogProduct.findMany({ where: { id: { in: items.map(i => i.product_id) } } });
    for (const it of items) {
      const p = products.find(pp => pp.id === it.product_id)!;
      it.vendor_id = p.vendor_id;
    }

    const subtotal = items.reduce((s, i) => s + i.total_cents, 0);
    const shipping = 0;
    const vatRate = await this.getVatRate(params.shippingAddress.country, params.shippingAddress.province);
    const vat = Math.round(subtotal * vatRate);
    const total = subtotal + shipping + vat;

    const orderNumber = this.generateOrderNumber();

    const result = await this.prisma.$transaction(async (tx) => {
      const order = await (tx as any).order.create({
        data: {
          order_number: orderNumber,
          customer_id: customer.id,
          email: params.email,
          subtotal_cents: subtotal,
          shipping_cents: shipping,
          vat_cents: vat,
          total_cents: total,
          shipping_address: params.shippingAddress,
          billing_address: params.billingAddress ?? params.shippingAddress,
        },
      });
      await (tx as any).orderEvent.create({ data: { order_id: order.id, status: 'PENDING', payment_status: 'INITIATED', description: 'Order created' } });
      for (const it of items) {
        await (tx as any).orderItem.create({ data: { ...it, order_id: order.id } });
        await tx.productVariant.update({
          where: { id: it.product_variant_id },
          data: { stock_quantity: { decrement: it.quantity } as any },
        });
        await (tx as any).inventoryTransaction.create({ data: { variant_id: it.product_variant_id, change: -it.quantity, reason: 'SALE' } });
      }
      return order;
    });
    return result;
  }

  async getVatRates(country?: string) {
    return this.prisma.vatRate.findMany({
      where: {
        ...(country && { country }),
        is_active: true,
      },
      orderBy: [{ country: 'asc' }, { province: 'asc' }],
    });
  }

  async updateOrder(orderId: string, input: { status?: string; payment_status?: string; shippingAddress?: any; billingAddress?: any; }) {
    const order = await (this.prisma as any).order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) throw new NotFoundException('Order not found');
    const data: any = {};
    if (input.status) data.status = input.status;
    if (input.payment_status) data.payment_status = input.payment_status;
    if (input.shippingAddress) data.shipping_address = input.shippingAddress;
    if (input.billingAddress) data.billing_address = input.billingAddress;
    const updated = await (this.prisma as any).order.update({ where: { id: orderId }, data });
    if (input.status || input.payment_status) {
      await (this.prisma as any).orderEvent.create({
        data: {
          order_id: orderId,
          status: input.status,
          payment_status: input.payment_status,
          description: 'Order updated',
        },
      });
    }
    return updated;
  }

  async deleteOrder(orderId: string) {
    const order = await (this.prisma as any).order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) throw new NotFoundException('Order not found');
    await this.prisma.$transaction(async (tx) => {
      for (const it of order.items) {
        await tx.productVariant.update({ where: { id: it.product_variant_id }, data: { stock_quantity: { increment: it.quantity } as any } });
        await (tx as any).inventoryTransaction.create({ data: { variant_id: it.product_variant_id, change: it.quantity, reason: 'RETURN' } });
      }
      await (tx as any).orderItem.deleteMany({ where: { order_id: orderId } });
      await (tx as any).payment.deleteMany({ where: { order_id: orderId } });
      await (tx as any).order.delete({ where: { id: orderId } });
    });
    return true;
  }

  async trackOrder(orderNumber: string, email: string) {
    const order = await (this.prisma as any).order.findFirst({
      where: { order_number: orderNumber, email },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async myOrders(userId: string) {
    const customer = await (this.prisma as any).customer.findFirst({ where: { user_id: userId } });
    if (!customer) return [];
    return (this.prisma as any).order.findMany({
      where: { customer_id: customer.id },
      include: { items: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrderById(orderId: string, userId: string, isAdmin: boolean) {
    const order = await (this.prisma as any).order.findUnique({ where: { id: orderId }, include: { items: true, customer: true } });
    if (!order) throw new NotFoundException('Order not found');
    if (isAdmin) return order;
    const customer = await (this.prisma as any).customer.findFirst({ where: { user_id: userId } });
    if (customer && order.customer_id === customer.id) return order;
    throw new NotFoundException('Order not found');
  }
}


