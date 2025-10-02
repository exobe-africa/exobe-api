import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryReason } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async adjustInventory(variantId: string, change: number, reason: string, notes: string | undefined, currentUserId: string) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) throw new NotFoundException('Variant not found');
    const product = await this.prisma.catalogProduct.findUnique({ where: { id: variant.productId } });
    const vendor = await this.prisma.vendor.findUnique({ where: { id: product!.vendorId } });
    if (!vendor || vendor.ownerUserId !== currentUserId) throw new ForbiddenException('Not vendor owner');

    const newQty = (variant.stockQuantity ?? 0) + change;
    await this.prisma.$transaction([
      this.prisma.productVariant.update({ where: { id: variantId }, data: { stockQuantity: newQty } }),
      this.prisma.inventoryTransaction.create({ data: { variantId, change, reason: reason as InventoryReason, notes } }),
    ]);
    return { variantId, stockQuantity: newQty };
  }
}


