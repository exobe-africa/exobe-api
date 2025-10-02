import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VariantsService {
  constructor(private prisma: PrismaService) {}

  async createVariant(data: any, currentUserId: string) {
    const product = await this.prisma.catalogProduct.findUnique({ where: { id: data.productId } });
    if (!product) throw new NotFoundException('Product not found');
    const vendor = await this.prisma.vendor.findUnique({ where: { id: product.vendorId } });
    if (!vendor || vendor.ownerUserId !== currentUserId) throw new ForbiddenException('Not vendor owner');
    return this.prisma.productVariant.create({ data: { ...data, attributes: data.attributes as any } });
  }

  async updateVariant(id: string, data: any, currentUserId: string) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id } });
    if (!variant) throw new NotFoundException('Variant not found');
    const product = await this.prisma.catalogProduct.findUnique({ where: { id: variant.productId } });
    const vendor = await this.prisma.vendor.findUnique({ where: { id: product!.vendorId } });
    if (!vendor || vendor.ownerUserId !== currentUserId) throw new ForbiddenException('Not vendor owner');
    const dataToUpdate: any = { ...data };
    if (data.attributes) dataToUpdate.attributes = data.attributes as any;
    return this.prisma.productVariant.update({ where: { id }, data: dataToUpdate });
  }

  async deleteVariant(id: string, currentUserId: string) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id } });
    if (!variant) throw new NotFoundException('Variant not found');
    const product = await this.prisma.catalogProduct.findUnique({ where: { id: variant.productId } });
    const vendor = await this.prisma.vendor.findUnique({ where: { id: product!.vendorId } });
    if (!vendor || vendor.ownerUserId !== currentUserId) throw new ForbiddenException('Not vendor owner');
    await this.prisma.productVariantMedia.deleteMany({ where: { variantId: id } });
    await this.prisma.inventoryTransaction.deleteMany({ where: { variantId: id } });
    await this.prisma.productVariant.delete({ where: { id } });
    return true;
  }

  async bulkCreateVariants(productId: string, variants: any[], currentUserId: string) {
    const product = await this.prisma.catalogProduct.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    const vendor = await this.prisma.vendor.findUnique({ where: { id: product.vendorId } });
    if (!vendor || vendor.ownerUserId !== currentUserId) throw new ForbiddenException('Not vendor owner');
    const created = [] as any[];
    for (const v of variants) {
      const rec = await this.prisma.productVariant.create({ data: { ...v, productId, attributes: (v as any).attributes } });
      created.push(rec);
    }
    return created;
  }

  addVariantMedia(variantId: string, data: any, currentUserId: string) {
    return this.prisma.productVariantMedia.create({ data: { variantId, url: data.url, type: (data.type as any) ?? undefined, position: data.position ?? 0 } });
  }
  removeVariantMedia(mediaId: string, currentUserId: string) {
    return this.prisma.productVariantMedia.delete({ where: { id: mediaId } }).then(() => true);
  }
}


