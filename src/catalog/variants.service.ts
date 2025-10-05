import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class VariantsService {
  constructor(private prisma: PrismaService, private storage: StorageService) {}

  async createVariant(data: any, currentUserId: string) {
    const product = await this.prisma.catalogProduct.findUnique({ where: { id: data.product_id } });
    if (!product) throw new NotFoundException('Product not found');
    const vendor = await this.prisma.vendor.findUnique({ where: { id: product.vendor_id } });
    const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
    if (!vendor || (vendor.owner_user_id !== currentUserId && user?.role !== 'ADMIN')) throw new ForbiddenException('Not vendor owner');
    const created = await this.prisma.productVariant.create({ data: { ...data, attributes: data.attributes as any, availableLocations: data.availableLocations ?? [] } });
    // Optionally, if caller passed selectedOptionValueIds: { [optionId]: optionValueId }
    if ((data as any).selectedOptionValueIds) {
      const pairs = Object.entries((data as any).selectedOptionValueIds) as [string, string][];
      for (const [optionId, optionValueId] of pairs) {
        await (this.prisma as any).productVariantOptionValue.create({ data: { variant_id: created.id, optionId, optionValueId } });
      }
    }
    return created;
  }

  async updateVariant(id: string, data: any, currentUserId: string) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id } });
    if (!variant) throw new NotFoundException('Variant not found');
    const product = await this.prisma.catalogProduct.findUnique({ where: { id: variant.product_id } });
    const vendor = await this.prisma.vendor.findUnique({ where: { id: product!.vendor_id } });
    const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
    if (!vendor || (vendor.owner_user_id !== currentUserId && user?.role !== 'ADMIN')) throw new ForbiddenException('Not vendor owner');
    const dataToUpdate: any = { ...data };
    if (data.attributes) dataToUpdate.attributes = data.attributes as any;
    return this.prisma.productVariant.update({ where: { id }, data: dataToUpdate });
  }

  async deleteVariant(id: string, currentUserId: string) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id } });
    if (!variant) throw new NotFoundException('Variant not found');
    const product = await this.prisma.catalogProduct.findUnique({ where: { id: variant.product_id } });
    const vendor = await this.prisma.vendor.findUnique({ where: { id: product!.vendor_id } });
    const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
    if (!vendor || (vendor.owner_user_id !== currentUserId && user?.role !== 'ADMIN')) throw new ForbiddenException('Not vendor owner');
    await this.prisma.productVariantMedia.deleteMany({ where: { variant_id: id } });
    await this.prisma.inventoryTransaction.deleteMany({ where: { variant_id: id } });
    await this.prisma.productVariant.delete({ where: { id } });
    return true;
  }

  async bulkCreateVariants(product_id: string, variants: any[], currentUserId: string) {
    const product = await this.prisma.catalogProduct.findUnique({ where: { id: product_id } });
    if (!product) throw new NotFoundException('Product not found');
    const vendor = await this.prisma.vendor.findUnique({ where: { id: product.vendor_id } });
    const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
    if (!vendor || (vendor.owner_user_id !== currentUserId && user?.role !== 'ADMIN')) throw new ForbiddenException('Not vendor owner');
    const created = [] as any[];
    for (const v of variants) {
      const rec = await this.prisma.productVariant.create({ data: { ...v, product_id, attributes: (v as any).attributes } });
      if ((v as any).selectedOptionValueIds) {
        const pairs = Object.entries((v as any).selectedOptionValueIds) as [string, string][];
        for (const [option_id, optionValueId] of pairs) {
          await (this.prisma as any).productVariantOptionValue.create({ data: { variant_id: rec.id, option_id, optionValueId } });
        }
      }
      created.push(rec);
    }
    return created;
  }

  async addVariantMedia(variant_id: string, data: any, currentUserId: string) {
    let url = data.url as string | undefined;
    if (!url && data.base64 && data.filename) {
      const buf = Buffer.from((data.base64 as string).split(',').pop() || data.base64, 'base64');
      const path = `variants/${variant_id}/${Date.now()}-${data.filename}`;
      const uploaded = await this.storage.uploadFileFromBuffer(path, buf, data.contentType || undefined);
      url = uploaded.publicUrl;
    }
    if (!url) throw new Error('Either url or base64+filename must be provided');
    return this.prisma.productVariantMedia.create({ data: { variant_id, url, type: (data.type as any) ?? undefined, position: data.position ?? 0 } });
  }
  removeVariantMedia(media_id: string, currentUserId: string) {
    return this.prisma.productVariantMedia.delete({ where: { id: media_id } }).then(() => true);
  }
}


