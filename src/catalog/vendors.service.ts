import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  createVendor(data: { name: string; slug: string; description?: string; ownerUser_id: string; seller_type?: 'RETAILER' | 'WHOLESALER' }) {
    return this.prisma.vendor.create({ data: { ...data, seller_type: data.seller_type ?? 'RETAILER', owner: { connect: { id: data.ownerUser_id } } } });
  }

  updateVendor(id: string, data: Partial<{ name: string; slug: string; description?: string; is_active: boolean; seller_type: 'RETAILER' | 'WHOLESALER' }>) {
    return this.prisma.vendor.update({ where: { id }, data });
  }

  getVendorById(id: string) {
    return this.prisma.vendor.findUnique({ where: { id } });
  }

  getVendorBySlug(slug: string) {
    return this.prisma.vendor.findUnique({ where: { slug } });
  }
  
  approveVendor(vendor_id: string) {
    return this.prisma.vendor.update({ where: { id: vendor_id }, data: { status: 'APPROVED', is_active: true } });
  }

  suspendVendor(vendor_id: string) {
    return this.prisma.vendor.update({ where: { id: vendor_id }, data: { status: 'SUSPENDED', is_active: false } });
  }

  async deleteVendorAsAdmin(vendor_id: string) {
    await this.prisma.catalogProduct.deleteMany({ where: { vendor_id: vendor_id } });
    await this.prisma.vendor.delete({ where: { id: vendor_id } });
    return true;
  }

  async requestVendorDeletion(vendor_id: string, requesterUser_id: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id: vendor_id } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    if (vendor.owner_user_id !== requesterUser_id) throw new ForbiddenException('Not vendor owner');
    await this.prisma.vendor.update({ where: { id: vendor_id }, data: { status: 'SUSPENDED', is_active: false } });
    return true;
  }
}


