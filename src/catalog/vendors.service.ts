import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  createVendor(data: { name: string; slug: string; description?: string; ownerUserId: string }) {
    return this.prisma.vendor.create({ data });
  }

  updateVendor(id: string, data: Partial<{ name: string; slug: string; description?: string; isActive: boolean }>) {
    return this.prisma.vendor.update({ where: { id }, data });
  }

  getVendorById(id: string) {
    return this.prisma.vendor.findUnique({ where: { id } });
  }

  getVendorBySlug(slug: string) {
    return this.prisma.vendor.findUnique({ where: { slug } });
  }

  approveVendor(vendorId: string) {
    return this.prisma.vendor.update({ where: { id: vendorId }, data: { status: 'APPROVED', isActive: true } });
  }

  suspendVendor(vendorId: string) {
    return this.prisma.vendor.update({ where: { id: vendorId }, data: { status: 'SUSPENDED', isActive: false } });
  }
}


