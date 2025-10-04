import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class VendorNotificationsService {
  constructor(private prisma: PrismaService, private email: EmailService) {}

  async getSettings(vendor_id: string) {
    const existing = await (this.prisma as any).vendorNotificationSettings.findFirst({ where: { vendor_id } });
    if (existing) return existing;
    return (this.prisma as any).vendorNotificationSettings.create({ data: { vendor_id } });
  }

  async updateSettings(vendor_id: string, input: any) {
    const existing = await (this.prisma as any).vendorNotificationSettings.findFirst({ where: { vendor_id } });
    if (!existing) return (this.prisma as any).vendorNotificationSettings.create({ data: { vendor_id, ...input } });
    return (this.prisma as any).vendorNotificationSettings.update({ where: { id: existing.id }, data: input });
  }

  async sendNewOrderEmailsForVendors(order: any) {
    // Gather vendors involved in order items
    const vendorIds = Array.from(new Set(order.items.map((i: any) => i.vendor_id)));
    const vendors = await (this.prisma as any).vendor.findMany({ where: { id: { in: vendorIds } }, include: { owner: true, notification_settings: true } });
    for (const v of vendors) {
      const settings = v.notification_settings || (await this.getSettings(v.id));
      if (!settings.email_notifications_enabled || !settings.order_new) continue;
      const to = v.owner?.email;
      if (!to) continue;
      await this.email.sendEmail({
        to,
        subject: `New order ${order.order_number}`,
        htmlBody: `<p>You have a new order.</p><p>Order: ${order.order_number}</p><p>Total: R ${(order.total_cents / 100).toFixed(2)}</p>`,
      });
    }
  }
}


