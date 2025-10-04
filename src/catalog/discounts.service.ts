import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiscountsService {
  constructor(private prisma: PrismaService) {}

  private assertVendorOwnership(vendorId: string | undefined, userId: string, isAdmin: boolean) {
    if (isAdmin) return;
    if (!vendorId) throw new ForbiddenException('Vendor ID required for sellers');
    // VendorsService already enforces ownership elsewhere; keep light here
  }

  async createDiscount(input: any, context: { userId: string; role: string }) {
    const isAdmin = context.role === 'ADMIN';
    this.assertVendorOwnership(input.vendor_id, context.userId, isAdmin);
    if (input.type?.endsWith('PERCENT') && (input.percent < 1 || input.percent > 100)) {
      throw new BadRequestException('Percent must be 1..100');
    }
    return (this.prisma as any).discount.create({ data: { ...input } });
  }

  async updateDiscount(id: string, input: any, context: { userId: string; role: string }) {
    const existing = await (this.prisma as any).discount.findUnique({ where: { id } });
    if (!existing) throw new BadRequestException('Discount not found');
    const isAdmin = context.role === 'ADMIN';
    if (!isAdmin && existing.vendor_id == null) throw new ForbiddenException('Sellers can only manage vendor discounts');
    return (this.prisma as any).discount.update({ where: { id }, data: input });
  }

  async deleteDiscount(id: string, context: { role: string }) {
    const isAdmin = context.role === 'ADMIN';
    if (!isAdmin) throw new ForbiddenException('Admin only');
    await (this.prisma as any).discount.delete({ where: { id } });
    return true;
  }

  async listDiscounts(filter: any, context: { userId: string; role: string }) {
    const isAdmin = context.role === 'ADMIN';
    const where: any = { ...filter };
    if (!isAdmin) where.vendor_id = filter?.vendor_id; // seller must scope
    return (this.prisma as any).discount.findMany({ where, orderBy: { created_at: 'desc' } });
  }

  // Core evaluation for cart/order
  async evaluateDiscountsForOrder(tx: any, params: {
    userId?: string;
    customer_id: string;
    email: string;
    items: Array<{ product_id: string; variant_id: string; quantity: number; price_cents: number }>;
    shipping_cents: number;
    subtotal_cents: number;
    country?: string;
    input_code?: string;
  }) {
    const now = new Date();
    const applicable: any[] = await tx.discount.findMany({
      where: {
        is_active: true,
        OR: [
          { method: 'AUTOMATIC' },
          ...(params.input_code ? [{ method: 'CODE', code: params.input_code }] : []),
        ],
        AND: [
          {
            OR: [
              { starts_at: null },
              { starts_at: { lte: now } },
            ],
          },
          {
            OR: [
              { ends_at: null },
              { ends_at: { gte: now } },
            ],
          },
        ],
      },
      include: { products: true, categories: true, collections: true },
    });

    let totalOrderDiscount = 0;
    const applied: Array<{ discount_id?: string; amount_cents: number; description?: string; code?: string; items?: Array<{ order_item_index: number; amount_cents: number }> }> = [];

    for (const d of applicable) {
      if (d.method === 'CODE' && d.code && params.input_code !== d.code) continue;
      if (d.min_purchase_amount_cents && params.subtotal_cents < d.min_purchase_amount_cents) continue;

      let amount = 0;
      if (d.type === 'ORDER_AMOUNT' && d.amount_cents) {
        amount = Math.min(d.amount_cents, params.subtotal_cents - totalOrderDiscount);
      } else if (d.type === 'ORDER_PERCENT' && d.percent) {
        amount = Math.floor((params.subtotal_cents * d.percent) / 100);
      } else if (d.type === 'FREE_SHIPPING') {
        amount = params.shipping_cents;
      } else if (d.type === 'PRODUCT_AMOUNT' || d.type === 'PRODUCT_PERCENT' || d.type === 'BUY_X_GET_Y') {
        const productIds = new Set<string>(d.products?.map((p: any) => p.product_id) || []);
        const collectionProductIdsSet = new Set<string>();
        if (d.collections?.length) {
          const colIds = d.collections.map((c: any) => c.collection_id);
          const cps = await tx.collectionProduct.findMany({ where: { collection_id: { in: colIds } } });
          for (const cp of cps) collectionProductIdsSet.add(cp.product_id);
        }
        const appliesAll = !!d.applies_to_all_products || (productIds.size === 0 && collectionProductIdsSet.size === 0);
        let discountOnProducts = 0;
        if (d.type === 'PRODUCT_AMOUNT' && d.amount_cents) {
          for (const it of params.items) {
            if (appliesAll || productIds.has(it.product_id) || collectionProductIdsSet.has(it.product_id)) {
              const amt = Math.min(d.amount_cents * it.quantity, it.price_cents * it.quantity);
              discountOnProducts += amt;
            }
          }
        } else if (d.type === 'PRODUCT_PERCENT' && d.percent) {
          for (const it of params.items) {
            if (appliesAll || productIds.has(it.product_id) || collectionProductIdsSet.has(it.product_id)) {
              const amt = Math.floor((it.price_cents * it.quantity * d.percent) / 100);
              discountOnProducts += amt;
            }
          }
        } else if (d.type === 'BUY_X_GET_Y' && d.buy_x_quantity && d.get_y_quantity) {
          let eligibleQty = 0;
          for (const it of params.items) if (appliesAll || productIds.has(it.product_id) || collectionProductIdsSet.has(it.product_id)) eligibleQty += it.quantity;
          const groups = Math.floor(eligibleQty / d.buy_x_quantity);
          const freeQty = groups * d.get_y_quantity;
          if (freeQty > 0) {
            const unit = Math.min(...params.items.filter(it => appliesAll || productIds.has(it.product_id) || collectionProductIdsSet.has(it.product_id)).map(it => it.price_cents));
            if (isFinite(unit)) discountOnProducts += unit * freeQty;
          }
        }
        amount = discountOnProducts;
      }

      amount = Math.max(0, Math.min(amount, params.subtotal_cents));
      if (amount > 0) {
        totalOrderDiscount += amount;
        // naive proportional split across eligible items for reporting
        const eligibleIndexes = params.items
          .map((it, idx) => ({ it, idx }))
          .filter(({ it }) => d.applies_to_all_products || (d.products?.some((p: any) => p.product_id === it.product_id)) || (d.collections?.length ? true : false))
          .map(({ idx }) => idx);
        const totalEligible = eligibleIndexes.reduce((s, idx) => s + params.items[idx].price_cents * params.items[idx].quantity, 0) || 1;
        const itemsAlloc = eligibleIndexes.map((idx) => {
          const base = params.items[idx].price_cents * params.items[idx].quantity;
          const alloc = Math.floor((base / totalEligible) * amount);
          return { order_item_index: idx, amount_cents: alloc };
        });
        // adjust rounding remainder
        const remainder = amount - itemsAlloc.reduce((s, a) => s + a.amount_cents, 0);
        if (remainder > 0 && itemsAlloc.length > 0) itemsAlloc[0].amount_cents += remainder;
        applied.push({ discount_id: d.id, amount_cents: amount, description: d.title, code: d.code || undefined, items: itemsAlloc });
      }
    }

    return { total_discount_cents: totalOrderDiscount, applied };
  }
}


