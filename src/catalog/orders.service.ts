import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GiftCardsService } from './gift-cards.service';
import { DiscountsService } from './discounts.service';
import { VendorNotificationsService } from './vendor-notifications.service';
import { CustomerNotificationsService } from '../users/customer-notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService, 
    private giftcards: GiftCardsService, 
    private discounts: DiscountsService, 
    private vendorNotifs: VendorNotificationsService,
    private customerNotifs: CustomerNotificationsService
  ) {}

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
    gift_card_code?: string;
    discount_code?: string;
  }) {
    const customer = await this.ensureCustomerForUserOrGuest(params);
    
    const variantIds = params.items.map(i => i.variant_id);
    const variants = await this.prisma.productVariant.findMany({ where: { id: { in: variantIds } } });
    
    const foundVariantIds = variants.map(v => v.id);
    const missingIds = variantIds.filter(id => !foundVariantIds.includes(id));
    
    const productsWithoutVariants = missingIds.length > 0
      ? await this.prisma.catalogProduct.findMany({ where: { id: { in: missingIds } } })
      : [];

    if (variants.length + productsWithoutVariants.length !== params.items.length) {
      throw new NotFoundException('One or more products/variants not found');
    }

    const items = params.items.map(i => {
      const v = variants.find(x => x.id === i.variant_id);
      if (v) {
        return {
          is_product_level: false,
          product_variant_id: v.id,
          product_id: v.product_id,
          vendor_id: undefined as any,
          sku: (v.sku ?? v.id) as any,
          title: v.title,
          attributes: v.attributes as any,
          price_cents: v.price_cents,
          quantity: i.quantity,
          total_cents: v.price_cents * i.quantity,
        } as any;
      }
      
      const p = productsWithoutVariants.find(x => x.id === i.variant_id);
      if (!p) throw new NotFoundException(`Product/variant ${i.variant_id} not found`);
      
      return {
        is_product_level: true,
        // Use product id as surrogate for product_variant_id to satisfy NOT NULL
        product_variant_id: p.id,
        product_id: p.id,
        vendor_id: p.vendor_id,
        sku: (p.sku ?? p.id) as any,
        title: p.title,
        attributes: {} as any,
        price_cents: p.price_in_cents || 0,
        quantity: i.quantity,
        total_cents: (p.price_in_cents || 0) * i.quantity,
      } as any;
    });

    const allProductIds = [...new Set(items.map(i => i.product_id))];
    const products = await this.prisma.catalogProduct.findMany({ where: { id: { in: allProductIds } } });
    for (const it of items) {
      if (!it.vendor_id) {
        const p = products.find(pp => pp.id === it.product_id)!;
        it.vendor_id = p.vendor_id;
      }
    }

    const subtotal = items.reduce((s, i) => s + i.total_cents, 0);
    const shipping = 0;
    const vatRate = await this.getVatRate(params.shippingAddress.country, params.shippingAddress.province);
    const vat = Math.round(subtotal * vatRate);
    let total = subtotal + shipping + vat;

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

      const discountEval = await this.discounts.evaluateDiscountsForOrder(tx, {
        userId: params.userId,
        customer_id: customer.id,
        email: params.email,
        items: items.map(i => ({ product_id: i.product_id, variant_id: i.product_variant_id, quantity: i.quantity, price_cents: i.price_cents })),
        shipping_cents: shipping,
        subtotal_cents: subtotal,
        country: params.shippingAddress?.country,
        input_code: params.discount_code,
      });
      if (discountEval.total_discount_cents > 0) {
        total = Math.max(0, total - discountEval.total_discount_cents);
        for (const ap of discountEval.applied) {
          const od = await (tx as any).orderDiscount.create({ data: { order_id: order.id, discount_id: ap.discount_id ?? null, amount_cents: ap.amount_cents, description: ap.description ?? null, code: ap.code ?? null } });
          if (ap.items && ap.items.length) {
            for (const alloc of ap.items) {
              const item = items[alloc.order_item_index];
              const orderItem = await (tx as any).orderItem.findFirst({ where: { order_id: order.id, product_variant_id: item.product_variant_id } });
              if (orderItem) {
                await (tx as any).orderDiscountItem.create({
                  data: {
                    order_discount_id: od.id,
                    order_item_id: orderItem.id,
                    product_id: item.product_id,
                    product_variant_id: item.product_variant_id,
                    amount_cents: alloc.amount_cents,
                  },
                });
              }
            }
          }
        }
        await (tx as any).order.update({ where: { id: order.id }, data: { total_cents: total } });
      }

      if (params.gift_card_code) {
        const applied = await this.giftcards.applyGiftCardWithinTransaction(tx, params.gift_card_code, total, order.id);
        if (applied.applied_cents > 0) {
          total = total - applied.applied_cents;
          await (tx as any).order.update({
            where: { id: order.id },
            data: { total_cents: total, gift_card_amount_cents: applied.applied_cents, gift_card_code: applied.code },
          });
        }
      }
      await (tx as any).orderEvent.create({ data: { order_id: order.id, status: 'PENDING', payment_status: 'INITIATED', description: 'Order created' } });
      for (const it of items as any[]) {
        const { is_product_level, ...dbItem } = it;
        const { product_id, ...rest } = dbItem as any;
        await (tx as any).orderItem.create({
          data: {
            ...rest,
            product: { connect: { id: product_id } },
            order: { connect: { id: order.id } },
          },
        });
        
        if (!is_product_level) {
          await tx.productVariant.update({
            where: { id: dbItem.product_variant_id },
            data: { stock_quantity: { decrement: dbItem.quantity } as any },
          });
          await (tx as any).inventoryTransaction.create({ data: { variant_id: dbItem.product_variant_id, change: -dbItem.quantity, reason: 'SALE' } });
        } else {
          await tx.catalogProduct.update({
            where: { id: dbItem.product_id },
            data: { stock_quantity: { decrement: dbItem.quantity } as any },
          });
        }
      }
      return { id: order.id } as any;
    });
    const fullOrder = await (this.prisma as any).order.findUnique({ where: { id: (result as any).id }, include: { items: true, events: true } });
    try { await this.vendorNotifs.sendNewOrderEmailsForVendors(fullOrder as any); } catch {}
    try { await this.customerNotifs.sendOrderConfirmationEmail(fullOrder as any); } catch {}
    return fullOrder;
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

  async updateOrder(orderId: string, input: { status?: string; payment_status?: string; shippingAddress?: any; billingAddress?: any; description?: string; }, actedByUserId?: string) {
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
          description: input.description || 'Order updated',
        },
      });
      
      // Send vendor notifications with appropriate messages
      let vendorMessage = input.description || 'Order updated';
      if (input.status === 'PROCESSING') {
        vendorMessage = 'Order is being processed. Please prepare your products for collection by the delivery driver.';
      } else if (input.status === 'SHIPPED') {
        vendorMessage = 'Order has been shipped to the customer.';
      } else if (input.status === 'FULFILLED') {
        vendorMessage = 'Order has been successfully delivered to the customer.';
      } else if (input.status === 'CANCELLED') {
        vendorMessage = input.description || 'Order has been cancelled.';
      }
      
      try { await this.vendorNotifs.sendOrderStatusChangeEmail(updated, vendorMessage); } catch {}
      
      if (input.status === 'SHIPPED') {
        try { await this.customerNotifs.sendShippingUpdateEmail(updated); } catch {}
      }
      
      if (input.status === 'FULFILLED') {
        try { await this.customerNotifs.sendDeliveryNotificationEmail(updated); } catch {}
      }
      
      if (input.status === 'CANCELLED') {
        try {
          const fullOrder = await (this.prisma as any).order.findUnique({ where: { id: orderId } });
          if (fullOrder) {
            try {
              await (this.prisma as any).orderCancellation.create({
                data: {
                  order_id: orderId,
                  reason: input.description || 'Order cancelled',
                  created_by_user_id: actedByUserId,
                },
              });
            } catch {}

            await (this.customerNotifs as any).email.sendTemplatedEmail({
              to: fullOrder.email,
              subject: `Your Order Has Been Cancelled - #${fullOrder.order_number}`,
              template: 'customer/order-cancelled',
              variables: {
                orderNumber: fullOrder.order_number,
                reason: input.description || 'Your order has been cancelled.',
                year: new Date().getFullYear(),
              },
            });
          }
        } catch {}
      }
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
      include: { 
        items: {
          include: {
            product: {
              include: {
                media: true
              }
            }
          }
        },
        events: true
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async myOrders(userId: string) {
    const customer = await (this.prisma as any).customer.findFirst({ where: { user_id: userId } });
    const user = await (this.prisma as any).user.findUnique({ where: { id: userId } });

    const where: any = { OR: [] };
    if (customer?.id) where.OR.push({ customer_id: customer.id });
    if (user?.email) where.OR.push({ email: { equals: user.email, mode: 'insensitive' } });
    if (where.OR.length === 0) return [];

    return (this.prisma as any).order.findMany({
      where,
      include: { items: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrderById(orderId: string, userId: string, isAdmin: boolean) {
    const order = await (this.prisma as any).order.findUnique({ 
      where: { id: orderId }, 
      include: { 
        items: {
          include: {
            product: {
              include: {
                vendor: true,
                media: true,
                category: true
              }
            },
            // Note: OrderItem does not have a Prisma relation named `product_variant`.
            // If variant-level media is required, fetch separately.
          }
        },
        customer: true,
        events: { orderBy: { created_at: 'desc' } },
        discounts: true
      } 
    });
    if (!order) throw new NotFoundException('Order not found');
    if (isAdmin) return order;
    const customer = await (this.prisma as any).customer.findFirst({ where: { user_id: userId } });
    if (customer && order.customer_id === customer.id) return order;
    throw new NotFoundException('Order not found');
  }
}

// Admin list orders
// NOTE: Exposed via GraphQL for ADMIN role only
export interface ListOrdersParams {
  status?: string;
  query?: string;
  take?: number;
  skip?: number;
}

export interface OrdersService { listOrders(params: ListOrdersParams): Promise<any[]> }

OrdersService.prototype.listOrders = async function (this: OrdersService, params: ListOrdersParams) {
  const { status, query, take = 50, skip = 0 } = params || {};
  const where: any = {};
  if (status) where.status = status;
  if (query) {
    where.OR = [
      { order_number: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
    ];
  }
  return (this as any).prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { created_at: 'desc' },
    take,
    skip,
  });
};


