import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService, private storage: StorageService) {}

  private async uniqueSlugForVendor(vendor_id: string, name: string) {
    const base = slugify(name) || 'collection';
    let slug = base;
    let i = 1;
    while (true) {
      const exists = await (this.prisma as any).collection.findFirst({ where: { vendor_id, slug } });
      if (!exists) return slug;
      slug = `${base}-${i++}`;
    }
  }

  private async assertVendorOwnership(vendor_id: string, userId: string, role: string) {
    if (role === 'ADMIN') return;
    const vendor = await (this.prisma as any).vendor.findUnique({ where: { id: vendor_id } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    if (vendor.owner_user_id !== userId && vendor.account_manager_user_id !== userId) {
      throw new ForbiddenException('Not authorized for this vendor');
    }
  }

  async createCollection(input: { vendor_id: string; name: string; description?: string; image?: string; imageBase64?: string; imageFilename?: string; imageContentType?: string }, ctx: { userId: string; role: string }) {
    await this.assertVendorOwnership(input.vendor_id, ctx.userId, ctx.role);
    const slug = await this.uniqueSlugForVendor(input.vendor_id, input.name);
    let image = input.image;
    if (!image && input.imageBase64 && input.imageFilename) {
      const buf = Buffer.from((input.imageBase64 as string).split(',').pop() || input.imageBase64, 'base64');
      const path = `collections/${input.vendor_id}/${Date.now()}-${input.imageFilename}`;
      const uploaded = await this.storage.uploadFileFromBuffer(path, buf, input.imageContentType || undefined);
      image = uploaded.publicUrl;
    }
    return (this.prisma as any).collection.create({ data: { vendor_id: input.vendor_id, name: input.name, description: input.description, image, slug } });
  }

  async updateCollection(id: string, input: { name?: string; description?: string; image?: string; imageBase64?: string; imageFilename?: string; imageContentType?: string; is_active?: boolean }, ctx: { userId: string; role: string }) {
    const existing = await (this.prisma as any).collection.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Collection not found');
    await this.assertVendorOwnership(existing.vendor_id, ctx.userId, ctx.role);
    const data: any = { ...input };
    if (input.name && input.name.trim()) {
      data.slug = await this.uniqueSlugForVendor(existing.vendor_id, input.name);
      data.name = input.name;
    }
    if (!data.image && input.imageBase64 && input.imageFilename) {
      const buf = Buffer.from((input.imageBase64 as string).split(',').pop() || input.imageBase64, 'base64');
      const path = `collections/${existing.vendor_id}/${Date.now()}-${input.imageFilename}`;
      const uploaded = await this.storage.uploadFileFromBuffer(path, buf, input.imageContentType || undefined);
      data.image = uploaded.publicUrl;
    }
    return (this.prisma as any).collection.update({ where: { id }, data });
  }

  async deleteCollection(id: string, ctx: { userId: string; role: string }) {
    const existing = await (this.prisma as any).collection.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Collection not found');
    await this.assertVendorOwnership(existing.vendor_id, ctx.userId, ctx.role);
    await (this.prisma as any).collectionProduct.deleteMany({ where: { collection_id: id } });
    await (this.prisma as any).discountCollection.deleteMany({ where: { collection_id: id } });
    await (this.prisma as any).collection.delete({ where: { id } });
    return true;
  }

  async addProducts(collection_id: string, product_ids: string[], ctx: { userId: string; role: string }) {
    const col = await (this.prisma as any).collection.findUnique({ where: { id: collection_id } });
    if (!col) throw new NotFoundException('Collection not found');
    await this.assertVendorOwnership(col.vendor_id, ctx.userId, ctx.role);
    for (const pid of product_ids) {
      await (this.prisma as any).collectionProduct.upsert({
        where: { collection_id_product_id: { collection_id, product_id: pid } },
        update: {},
        create: { collection_id, product_id: pid },
      });
    }
    return true;
  }

  async removeProduct(collection_id: string, product_id: string, ctx: { userId: string; role: string }) {
    const col = await (this.prisma as any).collection.findUnique({ where: { id: collection_id } });
    if (!col) throw new NotFoundException('Collection not found');
    await this.assertVendorOwnership(col.vendor_id, ctx.userId, ctx.role);
    await (this.prisma as any).collectionProduct.delete({ where: { collection_id_product_id: { collection_id, product_id } } });
    return true;
  }

  async listCollections(vendor_id: string) {
    return (this.prisma as any).collection.findMany({ where: { vendor_id }, orderBy: { created_at: 'desc' } });
  }
}


