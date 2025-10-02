import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: any, currentUserId: string, requireOwnership = true) {
    if (requireOwnership) {
      const vendor = await this.prisma.vendor.findUnique({ where: { id: data.vendorId } });
      if (!vendor) throw new NotFoundException('Vendor not found');
      if (vendor.ownerUserId !== currentUserId) throw new ForbiddenException('Not vendor owner');
    }
    const createData: any = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      isActive: data.isActive,
      featured: data.featured,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      vendor: { connect: { id: data.vendorId } },
      category: { connect: { id: data.categoryId } },
    };
    if (data.status) createData.status = data.status as ProductStatus;
    return this.prisma.catalogProduct.create({ data: createData });
  }

  async updateProduct(id: string, data: any, currentUserId: string, requireOwnership = true) {
    if (requireOwnership) {
      const product = await this.prisma.catalogProduct.findUnique({ where: { id } });
      if (!product) throw new NotFoundException('Product not found');
      const vendor = await this.prisma.vendor.findUnique({ where: { id: product.vendorId } });
      if (!vendor || vendor.ownerUserId !== currentUserId) throw new ForbiddenException('Not vendor owner');
    }
    const updateData: any = { ...data };
    if (data.categoryId) {
      updateData.category = { connect: { id: data.categoryId } };
      delete updateData.categoryId;
    }
    if (data.status) updateData.status = data.status as ProductStatus;
    return this.prisma.catalogProduct.update({ where: { id }, data: updateData });
  }

  async deleteProduct(id: string, currentUserId: string, requireOwnership = true) {
    if (requireOwnership) {
      const product = await this.prisma.catalogProduct.findUnique({ where: { id } });
      if (!product) throw new NotFoundException('Product not found');
      const vendor = await this.prisma.vendor.findUnique({ where: { id: product.vendorId } });
      if (!vendor || vendor.ownerUserId !== currentUserId) throw new ForbiddenException('Not vendor owner');
    }
    await this.prisma.productVariant.deleteMany({ where: { productId: id } });
    await this.prisma.productMedia.deleteMany({ where: { productId: id } });
    await this.prisma.catalogProduct.delete({ where: { id } });
    return true;
  }

  getProductById(id: string) {
    return this.prisma.catalogProduct.findUnique({
      where: { id },
      include: { variants: true, media: true, vendor: true, category: true },
    });
  }

  listProductsByVendor(vendorId: string) {
    return this.prisma.catalogProduct.findMany({ where: { vendorId }, orderBy: { createdAt: 'desc' } });
  }

  async listProductsPaged(params: any) {
    const { query, categoryId, vendorId, status, isActive, cursor, limit = 20 } = params;
    const where: any = {};
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (vendorId) where.vendorId = vendorId;
    if (typeof isActive === 'boolean') where.isActive = isActive;
    if (status) where.status = status as ProductStatus;

    const results = await this.prisma.catalogProduct.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
    });
    let nextCursor: string | null = null;
    if (results.length > limit) {
      const next = results.pop();
      nextCursor = next!.id;
    }
    return { items: results, nextCursor };
  }

  approveProduct(productId: string) {
    return this.prisma.catalogProduct.update({ where: { id: productId }, data: { status: 'ACTIVE', isActive: true } });
  }
  archiveProduct(productId: string) {
    return this.prisma.catalogProduct.update({ where: { id: productId }, data: { status: 'ARCHIVED', isActive: false } });
  }

  addProductMedia(productId: string, data: any, currentUserId: string) {
    return this.prisma.productMedia.create({ data: { productId, url: data.url, type: (data.type as any) ?? undefined, position: data.position ?? 0 } });
  }
  removeProductMedia(mediaId: string, currentUserId: string) {
    return this.prisma.productMedia.delete({ where: { id: mediaId } }).then(() => true);
  }
}


