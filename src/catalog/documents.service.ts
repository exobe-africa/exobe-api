import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import * as fs from 'fs';
import * as path from 'path';
import * as htmlPdf from 'html-pdf-node';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  private formatCurrency(cents: number, currency: string = 'ZAR'): string {
    const amount = cents / 100;
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  private formatAddress(addressJson: any): string {
    if (!addressJson) return '';
    const parts = [
      addressJson.address_line1,
      addressJson.address_line2,
      addressJson.city,
      addressJson.province,
      addressJson.postal_code,
      addressJson.country,
    ].filter(Boolean);
    return parts.join('<br>');
  }

  private formatItemAttributes(attributes: any): string {
    if (!attributes || typeof attributes !== 'object') return '';
    return Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }

  private async loadTemplate(templateName: string): Promise<string> {
    const templatePath = path.join(
      __dirname,
      '..',
      'email',
      'templates',
      'documents',
      `${templateName}.html`,
    );
    return fs.promises.readFile(templatePath, 'utf-8');
  }

  private replaceTemplateVars(template: string, vars: Record<string, any>): string {
    let result = template;
    
    for (const [key, value] of Object.entries(vars)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value ?? '');
    }

    result = result.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, condition, content) => {
      return vars[condition] ? content : '';
    });

    return result;
  }

  async generateInvoice(orderId: string): Promise<string> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        customer: true,
        discounts: true,
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.invoice_url) {
      return order.invoice_url;
    }

    const vatRate = order.vat_cents > 0 
      ? ((order.vat_cents / order.subtotal_cents) * 100).toFixed(0)
      : '15';

    const discountTotal = order.discounts.reduce(
      (sum, d) => sum + (d.amount_cents || 0),
      0,
    );

    const itemsRows = order.items
      .map(
        (item) => `
      <tr>
        <td>
          <div class="item-name">${item.title}</div>
          <div class="item-attributes">${this.formatItemAttributes(item.attributes)}</div>
        </td>
        <td>${item.sku}</td>
        <td>${item.quantity}</td>
        <td>${this.formatCurrency(item.price_cents, order.currency)}</td>
        <td>${this.formatCurrency(item.total_cents, order.currency)}</td>
      </tr>
    `,
      )
      .join('');

    const lastPayment = order.payments[order.payments.length - 1];
    const paymentMethod = lastPayment?.provider || 'Online Payment';
    const transactionId = lastPayment?.transaction_id || '';

    const templateVars = {
      orderNumber: order.order_number,
      invoiceDate: this.formatDate(order.created_at),
      customerName: `${order.customer.first_name} ${order.customer.last_name}`,
      billingAddress: this.formatAddress(order.billing_address),
      shippingAddress: this.formatAddress(order.shipping_address),
      itemsRows,
      subtotal: this.formatCurrency(order.subtotal_cents, order.currency),
      discount: discountTotal > 0 ? this.formatCurrency(discountTotal, order.currency) : '',
      shipping: this.formatCurrency(order.shipping_cents, order.currency),
      vat: this.formatCurrency(order.vat_cents, order.currency),
      vatRate,
      giftCard: order.gift_card_amount_cents > 0 
        ? this.formatCurrency(order.gift_card_amount_cents, order.currency) 
        : '',
      total: this.formatCurrency(order.total_cents, order.currency),
      paymentStatus: order.payment_status,
      paymentStatusClass: order.payment_status === 'PAID' ? 'paid' : 'pending',
      transactionId,
      paymentMethod,
      currency: order.currency,
      year: new Date().getFullYear().toString(),
    };

    const template = await this.loadTemplate('invoice');
    const html = this.replaceTemplateVars(template, templateVars);

    const file = { content: html };
    const options = {
      format: 'A4',
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    };

    const pdfBuffer = await htmlPdf.generatePdf(file, options);

    const fileName = `invoice-${order.order_number}.pdf`;
    const filePath = `orders/${orderId}/documents/${fileName}`;
    const uploadResult = await this.storage.uploadFileFromBuffer(
      filePath,
      pdfBuffer,
      'application/pdf',
    );

    await this.prisma.order.update({
      where: { id: orderId },
      data: { invoice_url: uploadResult.publicUrl },
    });

    return uploadResult.publicUrl;
  }

  async generateReceipt(orderId: string): Promise<string> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        customer: true,
        discounts: true,
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.payment_status !== 'PAID') {
      throw new Error('Receipt can only be generated for paid orders');
    }

    if (order.receipt_url) {
      return order.receipt_url;
    }

    const vatRate = order.vat_cents > 0 
      ? ((order.vat_cents / order.subtotal_cents) * 100).toFixed(0)
      : '15';

    const discountTotal = order.discounts.reduce(
      (sum, d) => sum + (d.amount_cents || 0),
      0,
    );

    const itemsRows = order.items
      .map(
        (item) => `
      <tr>
        <td>
          <div class="item-name">${item.title}</div>
          <div class="item-attributes">${this.formatItemAttributes(item.attributes)}</div>
        </td>
        <td>${item.sku}</td>
        <td>${item.quantity}</td>
        <td>${this.formatCurrency(item.price_cents, order.currency)}</td>
        <td>${this.formatCurrency(item.total_cents, order.currency)}</td>
      </tr>
    `,
      )
      .join('');

    // Get payment info
    const lastPayment = order.payments.find(p => p.status === 'PAID') || order.payments[order.payments.length - 1];
    const paymentMethod = lastPayment?.provider || 'Online Payment';
    const transactionId = lastPayment?.transaction_id || '';
    const paymentDate = lastPayment?.created_at || order.updated_at;

    const templateVars = {
      orderNumber: order.order_number,
      orderDate: this.formatDate(order.created_at),
      paymentDate: this.formatDate(paymentDate),
      customerName: `${order.customer.first_name} ${order.customer.last_name}`,
      customerEmail: order.email,
      customerPhone: order.customer.phone || order.customer.mobile || '',
      itemsRows,
      subtotal: this.formatCurrency(order.subtotal_cents, order.currency),
      discount: discountTotal > 0 ? this.formatCurrency(discountTotal, order.currency) : '',
      shipping: this.formatCurrency(order.shipping_cents, order.currency),
      vat: this.formatCurrency(order.vat_cents, order.currency),
      vatRate,
      giftCard: order.gift_card_amount_cents > 0 
        ? this.formatCurrency(order.gift_card_amount_cents, order.currency) 
        : '',
      total: this.formatCurrency(order.total_cents, order.currency),
      amountPaid: this.formatCurrency(order.total_cents - order.gift_card_amount_cents, order.currency),
      paymentStatus: 'Paid',
      transactionId,
      paymentMethod,
      currency: order.currency,
      year: new Date().getFullYear().toString(),
    };

    const template = await this.loadTemplate('receipt');
    const html = this.replaceTemplateVars(template, templateVars);

    const file = { content: html };
    const options = {
      format: 'A4',
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    };

    const pdfBuffer = await htmlPdf.generatePdf(file, options);

    const fileName = `receipt-${order.order_number}.pdf`;
    const filePath = `orders/${orderId}/documents/${fileName}`;
    const uploadResult = await this.storage.uploadFileFromBuffer(
      filePath,
      pdfBuffer,
      'application/pdf',
    );

    await this.prisma.order.update({
      where: { id: orderId },
      data: { receipt_url: uploadResult.publicUrl },
    });

    return uploadResult.publicUrl;
  }

  async getInvoiceUrl(orderId: string): Promise<string> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { invoice_url: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.invoice_url) {
      return order.invoice_url;
    }

    return this.generateInvoice(orderId);
  }

  async getReceiptUrl(orderId: string): Promise<string> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { receipt_url: true, payment_status: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.payment_status !== 'PAID') {
      throw new Error('Receipt can only be generated for paid orders');
    }

    if (order.receipt_url) {
      return order.receipt_url;
    }

    return this.generateReceipt(orderId);
  }
}

