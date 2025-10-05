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

  private formatCurrency(cents: number): string {
    return `R ${(cents / 100).toFixed(2)}`;
  }

  private formatAddress(address: any): string {
    if (!address) return '';
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.province,
      address.country,
      address.postal_code,
    ].filter(Boolean);
    return parts.join('<br>');
  }

  private formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-ZA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private getLogoUrl(): string {
    return `${process.env.FRONTEND_URL || 'https://exobe.africa'}/logo.png`;
  }

  async sendNewOrderEmailsForVendors(order: any) {
    // Fetch full order with all relations
    const fullOrder = await (this.prisma as any).order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product_variant: {
              include: {
                product: true,
              },
            },
          },
        },
        customer: true,
        discounts: true,
      },
    });

    if (!fullOrder) return;

    // Group items by vendor
    const vendorItems = new Map<string, any[]>();
    for (const item of fullOrder.items) {
      const vendorId = item.vendor_id;
      if (!vendorItems.has(vendorId)) {
        vendorItems.set(vendorId, []);
      }
      vendorItems.get(vendorId)!.push(item);
    }

    // Send email to each vendor
    for (const [vendorId, items] of vendorItems.entries()) {
      const vendor = await (this.prisma as any).vendor.findUnique({
        where: { id: vendorId },
        include: { owner: true, notification_settings: true },
      });

      if (!vendor) continue;

      const settings = vendor.notification_settings || (await this.getSettings(vendor.id));
      if (!settings.email_notifications_enabled || !settings.order_new) continue;

      const to = vendor.owner?.email;
      if (!to) continue;

      // Calculate vendor-specific totals
      const vendorSubtotal = items.reduce((sum, item) => sum + item.total_cents, 0);

      // Build items HTML
      const itemsHtml = items
        .map(
          (item) => `
          <div class="item">
            <p class="item-name">${item.title}</p>
            <p class="item-details">
              SKU: ${item.sku || 'N/A'} | Quantity: ${item.quantity}
              <span class="item-price">${this.formatCurrency(item.total_cents)}</span>
            </p>
          </div>
        `,
        )
        .join('');

      await this.email.sendTemplatedEmail({
        to,
        subject: `New Order #${fullOrder.order_number} - eXobe`,
        template: 'vendor/new-order',
        variables: {
          logoUrl: this.getLogoUrl(),
          orderNumber: fullOrder.order_number,
          orderDate: this.formatDate(fullOrder.created_at),
          customerName: `${fullOrder.customer?.first_name || ''} ${fullOrder.customer?.last_name || ''}`.trim() || 'Guest',
          customerEmail: fullOrder.email,
          customerPhone: fullOrder.customer?.phone || '',
          orderStatus: fullOrder.status || 'PENDING',
          paymentStatus: fullOrder.payment_status || 'INITIATED',
          items: itemsHtml,
          subtotal: this.formatCurrency(vendorSubtotal),
          discount: fullOrder.discounts?.length ? this.formatCurrency(fullOrder.discounts.reduce((sum: number, d: any) => sum + d.amount_cents, 0)) : '',
          shipping: this.formatCurrency(fullOrder.shipping_cents || 0),
          vat: this.formatCurrency(fullOrder.vat_cents || 0),
          giftCard: fullOrder.gift_card_amount_cents ? this.formatCurrency(fullOrder.gift_card_amount_cents) : '',
          total: this.formatCurrency(fullOrder.total_cents),
          shippingAddress: this.formatAddress(fullOrder.shipping_address),
          billingAddress: fullOrder.billing_address ? this.formatAddress(fullOrder.billing_address) : '',
          dashboardUrl: `${process.env.FRONTEND_URL || 'https://exobe.africa'}/vendor/orders/${fullOrder.id}`,
          year: new Date().getFullYear(),
        },
      });
    }
  }

  async sendOrderStatusChangeEmail(order: any, description?: string) {
    const fullOrder = await (this.prisma as any).order.findUnique({
      where: { id: order.id },
      include: {
        items: true,
        customer: true,
      },
    });

    if (!fullOrder) return;

    // Group items by vendor
    const vendorIds = Array.from(new Set(fullOrder.items.map((i: any) => i.vendor_id)));

    for (const vendorId of vendorIds) {
      const vendor = await (this.prisma as any).vendor.findUnique({
        where: { id: vendorId },
        include: { owner: true, notification_settings: true },
      });

      if (!vendor) continue;

      const settings = vendor.notification_settings || (await this.getSettings(vendor.id));
      
      // Check appropriate flag based on status
      let shouldSend = settings.email_notifications_enabled;
      if (fullOrder.payment_status === 'PAID' && !settings.order_paid) shouldSend = false;
      if (fullOrder.status === 'CANCELLED' && !settings.order_cancelled) shouldSend = false;
      if (fullOrder.payment_status === 'REFUNDED' && !settings.order_refunded) shouldSend = false;

      if (!shouldSend) continue;

      const to = vendor.owner?.email;
      if (!to) continue;

      let statusClass = '';
      if (fullOrder.payment_status === 'PAID') statusClass = 'paid';
      if (fullOrder.status === 'CANCELLED') statusClass = 'cancelled';
      if (fullOrder.payment_status === 'REFUNDED') statusClass = 'refunded';

      await this.email.sendTemplatedEmail({
        to,
        subject: `Order Status Update - #${fullOrder.order_number}`,
        template: 'vendor/order-status-change',
        variables: {
          logoUrl: this.getLogoUrl(),
          orderNumber: fullOrder.order_number,
          orderDate: this.formatDate(fullOrder.created_at),
          customerName: `${fullOrder.customer?.first_name || ''} ${fullOrder.customer?.last_name || ''}`.trim() || 'Guest',
          total: this.formatCurrency(fullOrder.total_cents),
          newStatus: fullOrder.status || 'PENDING',
          paymentStatus: fullOrder.payment_status || '',
          description: description || '',
          statusClass,
          dashboardUrl: `${process.env.FRONTEND_URL || 'https://exobe.africa'}/vendor/orders/${fullOrder.id}`,
          year: new Date().getFullYear(),
        },
      });
    }
  }

  async sendReturnRequestEmail(returnRequest: any) {
    const fullReturn = await (this.prisma as any).returnRequest.findUnique({
      where: { id: returnRequest.id },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        items: {
          include: {
            order_item: {
              include: {
                product_variant: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!fullReturn) return;

    // Group items by vendor
    const vendorItems = new Map<string, any[]>();
    for (const item of fullReturn.items) {
      const vendorId = item.order_item?.vendor_id;
      if (!vendorId) continue;
      if (!vendorItems.has(vendorId)) {
        vendorItems.set(vendorId, []);
      }
      vendorItems.get(vendorId)!.push(item);
    }

    for (const [vendorId, items] of vendorItems.entries()) {
      const vendor = await (this.prisma as any).vendor.findUnique({
        where: { id: vendorId },
        include: { owner: true, notification_settings: true },
      });

      if (!vendor) continue;

      const settings = vendor.notification_settings || (await this.getSettings(vendor.id));
      if (!settings.email_notifications_enabled || !settings.return_requested) continue;

      const to = vendor.owner?.email;
      if (!to) continue;

      const itemsHtml = items
        .map(
          (item) => `
          <div class="item">
            <p class="item-name">${item.order_item?.title || 'Product'}</p>
            <p class="item-details">
              Quantity: ${item.quantity} | Reason: ${item.reason || 'Not specified'}<br>
              Condition: ${item.condition || 'Not specified'}
            </p>
          </div>
        `,
        )
        .join('');

      await this.email.sendTemplatedEmail({
        to,
        subject: `Return Request - Order #${fullReturn.order.order_number}`,
        template: 'vendor/return-request',
        variables: {
          logoUrl: this.getLogoUrl(),
          orderNumber: fullReturn.order.order_number,
          returnId: fullReturn.id.slice(0, 8).toUpperCase(),
          requestDate: this.formatDate(fullReturn.created_at),
          customerName: `${fullReturn.order.customer?.first_name || ''} ${fullReturn.order.customer?.last_name || ''}`.trim() || 'Guest',
          returnStatus: fullReturn.status || 'REQUESTED',
          returnReason: fullReturn.reason || 'Not specified',
          additionalNotes: fullReturn.notes || '',
          items: itemsHtml,
          returnMethod: fullReturn.return_method || 'Not specified',
          refundMethod: fullReturn.refund_method || 'Not specified',
          itemCondition: '',
          dashboardUrl: `${process.env.FRONTEND_URL || 'https://exobe.africa'}/vendor/returns/${fullReturn.id}`,
          year: new Date().getFullYear(),
        },
      });
    }
  }

  async sendLowStockEmail(vendorId: string, variants: any[]) {
    const vendor = await (this.prisma as any).vendor.findUnique({
      where: { id: vendorId },
      include: { owner: true, notification_settings: true },
    });

    if (!vendor) return;

    const settings = vendor.notification_settings || (await this.getSettings(vendor.id));
    if (!settings.email_notifications_enabled || !settings.low_stock_threshold) return;

    const to = vendor.owner?.email;
    if (!to) return;

    const productsHtml = variants
      .map(
        (v) => `
        <div class="product-box">
          <p class="product-name">${v.product?.title || 'Product'}</p>
          <p class="product-detail"><strong>SKU:</strong> ${v.sku || 'N/A'}</p>
          <p class="product-detail"><strong>Variant:</strong> ${v.title || 'N/A'}</p>
          <p class="product-detail"><strong>Current Stock:</strong> ${v.stock_quantity}</p>
          <span class="stock-indicator ${v.stock_quantity === 0 ? '' : 'warning'}">
            ${v.stock_quantity === 0 ? 'Out of Stock' : 'Low Stock'}
          </span>
        </div>
      `,
      )
      .join('');

    await this.email.sendTemplatedEmail({
      to,
      subject: 'Low Stock Alert - eXobe',
      template: 'vendor/low-stock',
      variables: {
        logoUrl: this.getLogoUrl(),
        multiple: variants.length > 1,
        single: variants.length === 1,
        products: productsHtml,
        dashboardUrl: `${process.env.FRONTEND_URL || 'https://exobe.africa'}/vendor/inventory`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendProductStatusChangeEmail(vendorId: string, product: any, newStatus: string, reason?: string, changedBy?: string) {
    const vendor = await (this.prisma as any).vendor.findUnique({
      where: { id: vendorId },
      include: { owner: true, notification_settings: true },
    });

    if (!vendor) return;

    const settings = vendor.notification_settings || (await this.getSettings(vendor.id));
    if (!settings.email_notifications_enabled || !settings.product_status_change) return;

    const to = vendor.owner?.email;
    if (!to) return;

    let statusClass = newStatus === 'ACTIVE' ? 'active' : 'inactive';

    await this.email.sendTemplatedEmail({
      to,
      subject: `Product Status Changed - ${product.title}`,
      template: 'vendor/product-status-change',
      variables: {
        logoUrl: this.getLogoUrl(),
        productName: product.title,
        productSku: product.sku || 'N/A',
        variantInfo: '',
        changeDate: this.formatDate(new Date()),
        newStatus,
        reason: reason || '',
        changedBy: changedBy || 'System',
        statusClass,
        dashboardUrl: `${process.env.FRONTEND_URL || 'https://exobe.africa'}/vendor/products/${product.id}`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendReviewReceivedEmail(vendorId: string, review: any, product: any) {
    const vendor = await (this.prisma as any).vendor.findUnique({
      where: { id: vendorId },
      include: { owner: true, notification_settings: true },
    });

    if (!vendor) return;

    const settings = vendor.notification_settings || (await this.getSettings(vendor.id));
    if (!settings.email_notifications_enabled || !settings.review_received) return;

    const to = vendor.owner?.email;
    if (!to) return;

    const stars = '⭐'.repeat(review.rating);

    await this.email.sendTemplatedEmail({
      to,
      subject: `New Review for ${product.title}`,
      template: 'vendor/review-received',
      variables: {
        logoUrl: this.getLogoUrl(),
        productName: product.title,
        productSku: product.sku || 'N/A',
        variantInfo: '',
        stars,
        rating: review.rating,
        reviewerName: review.user?.name || 'Anonymous',
        reviewDate: this.formatDate(review.created_at),
        reviewComment: review.comment || '',
        orderNumber: '',
        dashboardUrl: `${process.env.FRONTEND_URL || 'https://exobe.africa'}/vendor/reviews`,
        year: new Date().getFullYear(),
      },
    });
  }
}


