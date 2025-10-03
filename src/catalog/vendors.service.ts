import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  createVendor(data: { name: string; slug: string; description?: string; ownerUserId: string; sellerType?: 'RETAILER' | 'WHOLESALER' }) {
    return (this.prisma as any).vendor.create({ data: { ...data, sellerType: (data as any).sellerType ?? 'RETAILER' } });
  }

  updateVendor(id: string, data: Partial<{ name: string; slug: string; description?: string; isActive: boolean; sellerType: 'RETAILER' | 'WHOLESALER' }>) {
    return (this.prisma as any).vendor.update({ where: { id }, data });
  }

  getVendorById(id: string) {
    return this.prisma.vendor.findUnique({ where: { id } });
  }

  getVendorBySlug(slug: string) {
    return this.prisma.vendor.findUnique({ where: { slug } });
  }

  approveVendor(vendorId: string) {
    return this.prisma.vendor.update({ where: { id: vendorId }, data: { status: 'APPROVED', is_active: true } });
  }

  suspendVendor(vendorId: string) {
    return this.prisma.vendor.update({ where: { id: vendorId }, data: { status: 'SUSPENDED', is_active: false } });
  }

  async deleteVendorAsAdmin(vendorId: string) {
    await this.prisma.catalogProduct.deleteMany({ where: { vendor_id: vendorId } });
    await this.prisma.vendor.delete({ where: { id: vendorId } });
    return true;
  }

  async requestVendorDeletion(vendorId: string, requesterUserId: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    if (vendor.owner_user_id !== requesterUserId) throw new ForbiddenException('Not vendor owner');
    await this.prisma.vendor.update({ where: { id: vendorId }, data: { status: 'SUSPENDED', is_active: false } });
    return true;
  }
}


