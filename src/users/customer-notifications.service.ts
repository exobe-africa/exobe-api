import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class CustomerNotificationsService {
  constructor(private prisma: PrismaService, private email: EmailService) {}

  async getSettings(user_id: string) {
    const existing = await (this.prisma as any).customerNotificationSettings.findFirst({ where: { user_id } });
    if (existing) return existing;
    return (this.prisma as any).customerNotificationSettings.create({ data: { user_id } });
  }

  async updateSettings(user_id: string, input: any) {
    const existing = await (this.prisma as any).customerNotificationSettings.findFirst({ where: { user_id } });
    if (!existing) return (this.prisma as any).customerNotificationSettings.create({ data: { user_id, ...input } });
    return (this.prisma as any).customerNotificationSettings.update({ where: { id: existing.id }, data: input });
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

  async sendOrderConfirmationEmail(order: any) {
    const fullOrder = await (this.prisma as any).order.findUnique({
      where: { id: order.id },
      include: {
        items: true,
        customer: { include: { user: true } },
        discounts: true,
      },
    });

    if (!fullOrder || !fullOrder.customer) return;

    const user = fullOrder.customer.user;
    if (!user) return;

    const settings = await this.getSettings(user.id);
    if (!settings.order_confirmations) return;

    const itemsHtml = fullOrder.items
      .map(
        (item: any) => `
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
      to: fullOrder.email,
      subject: `Order Confirmation - #${fullOrder.order_number}`,
      template: 'customer/order-confirmation',
      variables: {
        logoUrl: this.getLogoUrl(),
        orderNumber: fullOrder.order_number,
        orderDate: this.formatDate(fullOrder.created_at),
        orderStatus: fullOrder.status || 'PENDING',
        items: itemsHtml,
        subtotal: this.formatCurrency(fullOrder.subtotal_cents),
        discount: fullOrder.discounts?.length ? this.formatCurrency(fullOrder.discounts.reduce((sum: number, d: any) => sum + d.amount_cents, 0)) : '',
        shipping: this.formatCurrency(fullOrder.shipping_cents || 0),
        vat: this.formatCurrency(fullOrder.vat_cents || 0),
        giftCard: fullOrder.gift_card_amount_cents ? this.formatCurrency(fullOrder.gift_card_amount_cents) : '',
        total: this.formatCurrency(fullOrder.total_cents),
        shippingAddress: this.formatAddress(fullOrder.shipping_address),
        billingAddress: fullOrder.billing_address ? this.formatAddress(fullOrder.billing_address) : '',
        trackOrderUrl: `${process.env.FRONTEND_URL || 'https://exobe.africa'}/orders/${fullOrder.order_number}/track`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendShippingUpdateEmail(order: any, trackingNumber?: string, carrier?: string, estimatedDelivery?: string) {
    const fullOrder = await (this.prisma as any).order.findUnique({
      where: { id: order.id },
      include: {
        customer: { include: { user: true } },
      },
    });

    if (!fullOrder || !fullOrder.customer) return;

    const user = fullOrder.customer.user;
    if (!user) return;

    const settings = await this.getSettings(user.id);
    if (!settings.shipping_updates) return;

    await this.email.sendTemplatedEmail({
      to: fullOrder.email,
      subject: `Your Order Has Shipped - #${fullOrder.order_number}`,
      template: 'customer/shipping-update',
      variables: {
        logoUrl: this.getLogoUrl(),
        orderNumber: fullOrder.order_number,
        shippedDate: this.formatDate(new Date()),
        trackingNumber: trackingNumber || '',
        carrier: carrier || '',
        estimatedDelivery: estimatedDelivery || '',
        trackOrderUrl: `${process.env.FRONTEND_URL || 'https://exobe.africa'}/orders/${fullOrder.order_number}/track`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendDeliveryNotificationEmail(order: any, deliveredTo?: string) {
    const fullOrder = await (this.prisma as any).order.findUnique({
      where: { id: order.id },
      include: {
        customer: { include: { user: true } },
      },
    });

    if (!fullOrder || !fullOrder.customer) return;

    const user = fullOrder.customer.user;
    if (!user) return;

    const settings = await this.getSettings(user.id);
    if (!settings.delivery_notifications) return;

    await this.email.sendTemplatedEmail({
      to: fullOrder.email,
      subject: `Your Order Has Been Delivered - #${fullOrder.order_number}`,
      template: 'customer/delivery-notification',
      variables: {
        logoUrl: this.getLogoUrl(),
        orderNumber: fullOrder.order_number,
        deliveredDate: this.formatDate(new Date()),
        deliveredTo: deliveredTo || '',
        reviewUrl: `${process.env.FRONTEND_URL || 'https://exobe.africa'}/orders/${fullOrder.order_number}/review`,
        orderUrl: `${process.env.FRONTEND_URL || 'https://exobe.africa'}/orders/${fullOrder.order_number}`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendWishlistPriceDropEmail(userId: string, product: any, oldPrice: number, newPrice: number) {
    const user = await (this.prisma as any).user.findUnique({ where: { id: userId } });
    if (!user) return;

    const settings = await this.getSettings(userId);
    if (!settings.wishlist_updates) return;

    const productHtml = `
      <div class="product-card">
        ${product.images?.[0] ? `<img src="${product.images[0]}" alt="${product.title}" class="product-image">` : ''}
        <div class="product-info">
          <p class="product-name">${product.title}</p>
          <p class="product-price">
            ${this.formatCurrency(newPrice)}
            <span class="price-old">${this.formatCurrency(oldPrice)}</span>
          </p>
        </div>
      </div>
    `;

    await this.email.sendTemplatedEmail({
      to: user.email,
      subject: `Price Drop Alert - ${product.title}`,
      template: 'customer/wishlist-update',
      variables: {
        logoUrl: this.getLogoUrl(),
        updateTitle: 'Price Drop Alert! 🎉',
        updateMessage: 'Great news! An item on your wishlist is now on sale.',
        products: productHtml,
        wishlistUrl: `${process.env.FRONTEND_URL || 'https://exobe.africa'}/wishlist`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendWishlistBackInStockEmail(userId: string, product: any) {
    const user = await (this.prisma as any).user.findUnique({ where: { id: userId } });
    if (!user) return;

    const settings = await this.getSettings(userId);
    if (!settings.wishlist_updates) return;

    const productHtml = `
      <div class="product-card">
        ${product.images?.[0] ? `<img src="${product.images[0]}" alt="${product.title}" class="product-image">` : ''}
        <div class="product-info">
          <p class="product-name">${product.title}</p>
          <p class="product-price">${this.formatCurrency(product.price_cents)}</p>
          <span class="stock-badge">Back in Stock!</span>
        </div>
      </div>
    `;

    await this.email.sendTemplatedEmail({
      to: user.email,
      subject: `Back in Stock - ${product.title}`,
      template: 'customer/wishlist-update',
      variables: {
        logoUrl: this.getLogoUrl(),
        updateTitle: 'Back in Stock! ✨',
        updateMessage: 'An item on your wishlist is now back in stock. Get it before it\'s gone again!',
        products: productHtml,
        wishlistUrl: `${process.env.FRONTEND_URL || 'https://exobe.africa'}/wishlist`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendPasswordChangedEmail(userId: string, ipAddress: string, location?: string) {
    const user = await (this.prisma as any).user.findUnique({ where: { id: userId } });
    if (!user) return;

    const settings = await this.getSettings(userId);
    if (!settings.password_changes) return;

    await this.email.sendTemplatedEmail({
      to: user.email,
      subject: 'Your Password Was Changed - eXobe',
      template: 'customer/password-changed',
      variables: {
        logoUrl: this.getLogoUrl(),
        changedDate: this.formatDate(new Date()),
        ipAddress,
        location: location || '',
        supportUrl: `${process.env.FRONTEND_URL || 'https://exobe.africa'}/support`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendLoginAlertEmail(userId: string, device: string, browser: string, ipAddress: string, location?: string) {
    const user = await (this.prisma as any).user.findUnique({ where: { id: userId } });
    if (!user) return;

    const settings = await this.getSettings(userId);
    if (!settings.login_alerts) return;

    await this.email.sendTemplatedEmail({
      to: user.email,
      subject: 'New Login to Your Account - eXobe',
      template: 'customer/login-alert',
      variables: {
        logoUrl: this.getLogoUrl(),
        loginDate: this.formatDate(new Date()),
        device,
        browser,
        ipAddress,
        location: location || '',
        securityUrl: `${process.env.FRONTEND_URL || 'https://exobe.africa'}/settings/security`,
        year: new Date().getFullYear(),
      },
    });
  }
}

