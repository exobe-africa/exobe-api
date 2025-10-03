import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: any, currentUserId: string, requireOwnership = true) {
    if (requireOwnership) {
      const vendor = await this.prisma.vendor.findUnique({ where: { id: data.vendor_id } });
      if (!vendor) throw new NotFoundException('Vendor not found');
      const currentUser = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (vendor.owner_user_id !== currentUserId && currentUser?.role !== 'ADMIN') {
        throw new ForbiddenException('Not vendor owner');
      }
    }
    const createData: any = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      features: data.features ?? [],
      availableLocations: data.availableLocations ?? [],
      is_active: data.is_active,
      featured: data.featured,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      vendor: { connect: { id: data.vendor_id } },
      category: { connect: { id: data.categoryId } },
    };
    if (data.status) createData.status = data.status as ProductStatus;
    return this.prisma.catalogProduct.create({ data: createData });
  }

  async updateProduct(id: string, data: any, currentUserId: string, requireOwnership = true) {
    if (requireOwnership) {
      const product = await this.prisma.catalogProduct.findUnique({ where: { id } });
      if (!product) throw new NotFoundException('Product not found');
      const vendor = await this.prisma.vendor.findUnique({ where: { id: product.vendor_id } });
      const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (!vendor || (vendor.owner_user_id !== currentUserId && user?.role !== 'ADMIN')) throw new ForbiddenException('Not vendor owner');
    }
    const updateData: any = { ...data };
    if (data.features) updateData.features = data.features;
    if (data.availableLocations) updateData.availableLocations = data.availableLocations;
    if (data.category_id) {
      updateData.category = { connect: { id: data.category_id } };
      delete updateData.categoryId;
    }
    if (data.status) updateData.status = data.status as ProductStatus;
    return this.prisma.catalogProduct.update({ where: { id }, data: updateData });
  }

  async deleteProduct(id: string, currentUserId: string, requireOwnership = true) {
    if (requireOwnership) {
      const product = await this.prisma.catalogProduct.findUnique({ where: { id } });
      if (!product) throw new NotFoundException('Product not found');
      const vendor = await this.prisma.vendor.findUnique({ where: { id: product.vendor_id } });
      const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (!vendor || (vendor.owner_user_id !== currentUserId && user?.role !== 'ADMIN')) throw new ForbiddenException('Not vendor owner');
    }
    await this.prisma.productVariant.deleteMany({ where: { product_id: id } });
    await this.prisma.productMedia.deleteMany({ where: { product_id: id } });
    await this.prisma.catalogProduct.delete({ where: { id } });
    return true;
  }

  getProductById(id: string) {
    return this.prisma.catalogProduct.findUnique({
      where: { id },
      include: ({} as any).constructor({
        variants: true,
        media: true,
        vendor: true,
        category: true,
        options: { include: { values: true } },
      }),
    });
  }

  listProductsByVendor(vendor_id: string) {
    return this.prisma.catalogProduct.findMany({ where: { vendor_id }, orderBy: { created_at: 'desc' } });
  }

  async listProductsPaged(params: any) {
    const { query, category_id, vendor_id, status, is_active, cursor, limit = 20 } = params;
    const where: any = {};
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }
    if (category_id) where.category_id = category_id;
    if (vendor_id) where.vendor_id = vendor_id;
    if (typeof is_active === 'boolean') where.is_active = is_active;
    if (status) where.status = status as ProductStatus;

    const results = await this.prisma.catalogProduct.findMany({
      where,
      orderBy: { created_at: 'desc' },
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

  approveProduct(product_id: string) {
    return this.prisma.catalogProduct.update({ where: { id: product_id }, data: { status: 'ACTIVE', is_active: true } });
  }
  archiveProduct(product_id: string) {
    return this.prisma.catalogProduct.update({ where: { id: product_id }, data: { status: 'ARCHIVED', is_active: false } });
  }

  addProductMedia(product_id: string, data: any, currentUserId: string) {
    return this.prisma.productMedia.create({ data: { product_id, url: data.url, type: (data.type as any) ?? undefined, position: data.position ?? 0 } });
  }
  removeProductMedia(mediaId: string, currentUserId: string) {
    return this.prisma.productMedia.delete({ where: { id: mediaId } }).then(() => true);
  }
}


