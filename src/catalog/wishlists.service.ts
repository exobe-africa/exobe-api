import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistsService {
  constructor(private prisma: PrismaService) {}

  private async ensureWishlist(userId: string) {
    let wl = await (this.prisma as any).wishlist.findFirst({ where: { user_id: userId }, include: { items: true } });
    if (!wl) wl = await (this.prisma as any).wishlist.create({ data: { user_id: userId } });
    return wl;
  }

  async getWishlist(userId: string) {
    return (this.prisma as any).wishlist.findFirst({
      where: { user_id: userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                media: true,
                category: true,
                variants: true,
              },
            },
          },
        },
      },
    });
  }

  async addToWishlist(userId: string, input: { product_id: string; product_variant_id?: string }) {
    await this.ensureWishlist(userId);
    const wl = await (this.prisma as any).wishlist.findFirst({ where: { user_id: userId } });
    if (!wl) throw new ForbiddenException('Wishlist not available');

    const product = await this.prisma.catalogProduct.findUnique({ where: { id: input.product_id } });
    if (!product) throw new NotFoundException('Product not found');

    // If a variant is specified, validate then upsert by unique composite key
    if (input.product_variant_id) {
      const variant = await this.prisma.productVariant.findUnique({ where: { id: input.product_variant_id } });
      if (!variant) throw new NotFoundException('Variant not found');
      return (this.prisma as any).wishlistItem.upsert({
        where: {
          wishlist_id_product_id_product_variant_id: {
            wishlist_id: wl.id,
            product_id: input.product_id,
            product_variant_id: input.product_variant_id,
          },
        },
        create: { wishlist_id: wl.id, product_id: input.product_id, product_variant_id: input.product_variant_id },
        update: {},
      });
    }

    // No variant: upsert cannot be used with nullable field inside a composite key.
    // Do find-first then create if needed.
    const existing = await (this.prisma as any).wishlistItem.findFirst({
      where: { wishlist_id: wl.id, product_id: input.product_id, product_variant_id: null },
    });
    if (existing) return existing;
    return (this.prisma as any).wishlistItem.create({
      data: { wishlist_id: wl.id, product_id: input.product_id, product_variant_id: null },
    });
  }

  async removeFromWishlist(userId: string, input: { product_id: string; product_variant_id?: string }) {
    const wl = await (this.prisma as any).wishlist.findFirst({ where: { user_id: userId } });
    if (!wl) return true;
    const item = await (this.prisma as any).wishlistItem.findFirst({
      where: { wishlist_id: wl.id, product_id: input.product_id, product_variant_id: input.product_variant_id ?? null },
    });
    if (!item) return true;
    await (this.prisma as any).wishlistItem.delete({ where: { id: item.id } });
    return true;
  }
}


