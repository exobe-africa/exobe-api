import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  applySeller(data: any, sellerRole: Role) {
    return this.prisma.sellerApplication.create({
      data: { ...data, sellerRole },
    });
  }

  applyServiceProvider(data: any) {
    return this.prisma.serviceProviderApplication.create({
      data,
    });
  }

  async approveSellerApplication(applicationId: string) {
    const app = await this.prisma.sellerApplication.findUnique({ where: { id: applicationId } });
    if (!app) throw new NotFoundException('Application not found');
    await this.prisma.sellerApplication.update({ where: { id: applicationId }, data: { status: 'APPROVED' } });
    const owner = await this.prisma.user.findUnique({ where: { email: app.email } });
    const ownerUserId = owner?.id ?? (await this.prisma.user.create({ data: { email: app.email, password: '', name: `${app.first_name} ${app.last_name}` } })).id;
    const slugBase = app.business_name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${slugBase}-${Math.random().toString(36).slice(2, 6)}`;
    const sellerType = app.seller_role === 'RETAILER' ? 'RETAILER' : 'WHOLESALER';
    const vendor = await (this.prisma as any).vendor.create({
      data: {
        name: app.business_name,
        slug,
        description: app.business_summary ?? undefined,
        owner_user_id: ownerUserId,
        account_manager_user_id: ownerUserId,
        status: 'APPROVED',
        is_active: true,
        seller_type: sellerType,
      },
    });
    if (sellerType === 'RETAILER') {
      await (this.prisma as any).retailerAccount.create({ data: { vendor_id: vendor.id } });
    } else {
      await (this.prisma as any).wholesalerAccount.create({ data: { vendor_id: vendor.id } });
    }
    return vendor;
  }
}


