import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OptionsService {
  constructor(private prisma: PrismaService) {}

  async createOption(product_id: string, name: string, position = 0, currentUserId: string) {
    const product = await this.prisma.catalogProduct.findUnique({ where: { id: product_id } });
    if (!product) throw new NotFoundException('Product not found');
    const vendor = await this.prisma.vendor.findUnique({ where: { id: product.vendor_id } });
    if (!vendor || vendor.owner_user_id !== currentUserId) throw new ForbiddenException('Not vendor owner');
    return (this.prisma as any).productOption.create({ data: { product_id, name, position }, include: { values: true } });
  }

  async addOptionValue(option_id: string, value: string, position = 0, currentUserId: string) {
    const option = await this.prisma.productOption.findUnique({ where: { id: option_id } });
    if (!option) throw new NotFoundException('Option not found');
    const product = await this.prisma.catalogProduct.findUnique({ where: { id: option.product_id } });
    const vendor = await this.prisma.vendor.findUnique({ where: { id: product!.vendor_id } });
    if (!vendor || vendor.owner_user_id !== currentUserId) throw new ForbiddenException('Not vendor owner');
    await (this.prisma as any).productOptionValue.create({ data: { option_id, value, position } });
    return (this.prisma as any).productOption.findUnique({ where: { id: option_id }, include: { values: { orderBy: { position: 'asc' } } } });
  }

  listOptions(product_id: string) {
    return (this.prisma as any).productOption.findMany({ where: { product_id }, orderBy: { position: 'asc' }, include: { values: { orderBy: { position: 'asc' } } } });
  }
}


