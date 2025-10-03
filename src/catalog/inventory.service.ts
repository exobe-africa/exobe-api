import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryReason } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async adjustInventory(variant_id: string, change: number, reason: string, notes: string | undefined, currentUserId: string) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id: variant_id } });
    if (!variant) throw new NotFoundException('Variant not found');
    const product = await this.prisma.catalogProduct.findUnique({ where: { id: variant.product_id } });
    const vendor = await this.prisma.vendor.findUnique({ where: { id: product!.vendor_id } });
    if (!vendor || vendor.owner_user_id !== currentUserId) throw new ForbiddenException('Not vendor owner');

    const newQty = (variant.stock_quantity ?? 0) + change;
    await this.prisma.$transaction([
      this.prisma.productVariant.update({ where: { id: variant_id }, data: { stock_quantity: newQty } }),
      this.prisma.inventoryTransaction.create({ data: { variant_id: variant_id, change, reason: reason as InventoryReason, notes } }),
    ]);
    return { variant_id, stock_quantity: newQty };
  }
}


