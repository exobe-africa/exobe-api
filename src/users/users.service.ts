import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerNotificationsService } from './customer-notifications.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private customerNotifs: CustomerNotificationsService,
    private config: ConfigService,
  ) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: { email: string; password: string; name?: string }) {
    return this.prisma.user.create({ data });
  }

  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    agreeToTerms: boolean;
    subscribeNewsletter: boolean;
  }) {
    const exists = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new BadRequestException('Email already in use');
    if (!data.agreeToTerms) throw new BadRequestException('Terms must be accepted');

    const hashed = await bcrypt.hash(data.password, 12);
    const name = [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || undefined;

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashed,
          name,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          agree_to_terms: data.agreeToTerms,
          subscribe_newsletter: data.subscribeNewsletter,
        },
      });

      const existingGuestCustomer = await (tx as any).customer.findFirst({
        where: { email: data.email, user_id: null },
        orderBy: { created_at: 'desc' },
      });
      if (existingGuestCustomer) {
        await (tx as any).customer.update({
          where: { id: existingGuestCustomer.id },
          data: {
            user_id: user.id,
            first_name: existingGuestCustomer.first_name || (data.firstName ?? ''),
            last_name: existingGuestCustomer.last_name || (data.lastName ?? ''),
            phone: existingGuestCustomer.phone || data.phone,
          },
        });
      }

      await this.customerNotifs.getSettings(user.id, tx);

      this.sendWelcomeEmail(user).catch(err => {
        console.error('Failed to send welcome email:', err);
      });

      return user;
    });
  }

  private async sendWelcomeEmail(user: { email: string; first_name?: string | null; last_name?: string | null; name?: string | null }) {
    try {
      const emailService = new EmailService();
      const frontendUrl = this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
      const firstName = user.first_name || user.name?.split(' ')[0] || 'there';

      await emailService.sendTemplatedEmail({
        to: user.email,
        subject: 'Welcome to eXobe - Start Your Shopping Journey! 🎉',
        template: 'customer/welcome',
        variables: {
          firstName,
          websiteUrl: frontendUrl,
          year: new Date().getFullYear().toString(),
        },
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async registerCustomer(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    agreeToTerms: boolean;
    subscribeNewsletter: boolean;
  }) {
    return this.register(data);
  }

  async update(
    id: string,
    data: { email?: string; password?: string; name?: string },
  ) {
    const updateData = { ...data } as any;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 12);
    }
    return this.prisma.user.update({ where: { id }, data: updateData });
  }

  async updateProfile(userId: string, data: { first_name?: string; last_name?: string; email?: string; phone?: string; date_of_birth?: Date }) {
    const name = [data.first_name, data.last_name].filter(Boolean).join(' ').trim() || undefined;
    return this.prisma.user.update({ where: { id: userId }, data: { ...data, name } as any });
  }

  async updatePassword(
    userId: string,
    current_password: string,
    new_password: string,
    opts?: { ipAddress?: string; location?: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const ok = await bcrypt.compare(current_password, user.password);
    if (!ok) throw new ForbiddenException('Current password is incorrect');
    const hashed = await bcrypt.hash(new_password, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    try {
      const ip = opts?.ipAddress || 'Unknown';
      await this.customerNotifs.sendPasswordChangedEmail(userId, ip, opts?.location);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to send password-changed email:', err);
    }
    return true;
  }

  async anonymizeUser(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted-${userId}@deleted.exobe.africa`,
        name: `Deleted User ${userId.slice(0, 8)}`,
        first_name: null,
        last_name: null,
        phone: null,
        date_of_birth: null,
        is_active: false,
      }
    });
    return true;
  }

  delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  private normalizeAddressType(type?: string): string {
    if (!type) return 'BUSINESS';
    const t = String(type).toLowerCase();
    if (t === 'home' || t === 'personal') return 'PERSONAL';
    if (t === 'work' || t === 'business') return 'BUSINESS';
    if (t === 'billing') return 'BILLING';
    if (t === 'shipping' || t === 'other') return 'SHIPPING';
    return 'BUSINESS';
  }

  async createAddress(input: any, currentUserId: string) {
    const ownerId = input.userId || input.user_id || currentUserId;
    if (ownerId !== currentUserId) {
      const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (user?.role !== 'ADMIN') throw new ForbiddenException('Not authorized');
    }

    const data = {
      user_id: ownerId,
      type: this.normalizeAddressType(input.type),
      address_name: input.addressName ?? input.address_name ?? '',
      address_line1: input.addressLine1 ?? input.address_line1,
      address_line2: input.addressLine2 ?? input.address_line2 ?? undefined,
      city: input.city,
      province: input.province ?? undefined,
      country: input.country ?? 'South Africa',
      postal_code: input.postalCode ?? input.postal_code,
      default_address: !!(input.defaultAddress ?? input.default_address),
    };

    // Basic guards for required fields to return clear messages
    const required = ['user_id','type','address_name','address_line1','city','country','postal_code'] as const;
    for (const key of required) {
      if (!(data as any)[key] || String((data as any)[key]).trim() === '') {
        throw new (require('@nestjs/common').BadRequestException)(`Missing required field: ${key}`);
      }
    }

    // Debug log for visibility
    // eslint-disable-next-line no-console
    console.log('[createAddress] ownerId=', ownerId, 'payload=', data);

    try {
      return await this.prisma.$transaction(async (tx: any) => {
        // If setting as default, unset previous defaults for this user
        if (data.default_address) {
          await tx.userAddress.updateMany({ where: { user_id: ownerId }, data: { default_address: false } });
        }
        return await tx.userAddress.create({ data });
      });
    } catch (e: any) {
      // Surface a clearer error upstream for debugging/client messaging
      throw new (require('@nestjs/common').BadRequestException)(e?.message || 'Invalid address input');
    }
  }

  async updateAddress(id: string, data: any, currentUserId: string) {
    const address = await (this.prisma as any).userAddress.findUnique({ where: { id } });
    if (!address) throw new NotFoundException('Address not found');
    if (address.user_id !== currentUserId) {
      const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (user?.role !== 'ADMIN') throw new ForbiddenException('Not authorized');
    }
    const updateData: any = {};
    if (data.type) updateData.type = this.normalizeAddressType(data.type);
    if (data.addressName ?? data.address_name) updateData.address_name = data.addressName ?? data.address_name;
    if (data.addressLine1 ?? data.address_line1) updateData.address_line1 = data.addressLine1 ?? data.address_line1;
    if (data.addressLine2 ?? data.address_line2) updateData.address_line2 = data.addressLine2 ?? data.address_line2;
    if (data.city) updateData.city = data.city;
    if (data.province !== undefined) updateData.province = data.province;
    if (data.country) updateData.country = data.country;
    if (data.postalCode ?? data.postal_code) updateData.postal_code = data.postalCode ?? data.postal_code;

    const setDefault = !!(data.defaultAddress ?? data.default_address);
    return await (this.prisma as any).$transaction(async (tx: any) => {
      if (setDefault) {
        await tx.userAddress.updateMany({ where: { user_id: currentUserId }, data: { default_address: false } });
        updateData.default_address = true;
      }
      return tx.userAddress.update({ where: { id }, data: updateData });
    });
  }

  async deleteAddress(id: string, currentUserId: string) {
    const address = await (this.prisma as any).userAddress.findUnique({ where: { id } });
    if (!address) throw new NotFoundException('Address not found');
    if (address.user_id !== currentUserId) {
      const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (user?.role !== 'ADMIN') throw new ForbiddenException('Not authorized');
    }
    await (this.prisma as any).userAddress.delete({ where: { id } });
    return true;
  }

  getUserAddresses(userId: string) {
    return (this.prisma as any).userAddress.findMany({ where: { user_id: userId } });
  }

  async getNotificationSettings(userId: string) {
    return this.customerNotifs.getSettings(userId);
  }

  async updateNotificationSettings(userId: string, input: any, tx?: any) {
    return this.customerNotifs.updateSettings(userId, input, tx);
  }
}
