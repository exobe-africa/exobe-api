import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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

      // Link existing guest customer (same email, no user linked) to this new user
      const existingGuestCustomer = await (tx as any).customer.findFirst({
        where: { email: data.email, user_id: null },
        orderBy: { created_at: 'desc' },
      });
      if (existingGuestCustomer) {
        await (tx as any).customer.update({
          where: { id: existingGuestCustomer.id },
          data: {
            user_id: user.id,
            // Preserve existing values; fill from registration if missing
            first_name: existingGuestCustomer.first_name || (data.firstName ?? ''),
            last_name: existingGuestCustomer.last_name || (data.lastName ?? ''),
            phone: existingGuestCustomer.phone || data.phone,
          },
        });
      }

      return user;
    });
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

  async updatePassword(userId: string, current_password: string, new_password: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const ok = await bcrypt.compare(current_password, user.password);
    if (!ok) throw new ForbiddenException('Current password is incorrect');
    const hashed = await bcrypt.hash(new_password, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return true;
  }

  delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async createAddress(data: any, currentUserId: string) {
    if (data.user_id !== currentUserId) {
      const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (user?.role !== 'ADMIN') throw new ForbiddenException('Not authorized');
    }
    return (this.prisma as any).userAddress.create({ data });
  }

  async updateAddress(id: string, data: any, currentUserId: string) {
    const address = await (this.prisma as any).userAddress.findUnique({ where: { id } });
    if (!address) throw new NotFoundException('Address not found');
    if (address.user_id !== currentUserId) {
      const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (user?.role !== 'ADMIN') throw new ForbiddenException('Not authorized');
    }
    return (this.prisma as any).userAddress.update({ where: { id }, data });
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
    const existing = await (this.prisma as any).customerNotificationSettings.findFirst({ where: { user_id: userId } });
    if (existing) return existing;
    return (this.prisma as any).customerNotificationSettings.create({ data: { user_id: userId } });
  }

  async updateNotificationSettings(userId: string, input: any) {
    const existing = await (this.prisma as any).customerNotificationSettings.findFirst({ where: { user_id: userId } });
    if (!existing) {
      return (this.prisma as any).customerNotificationSettings.create({ data: { user_id: userId, ...input } });
    }
    return (this.prisma as any).customerNotificationSettings.update({ where: { id: existing.id }, data: input });
  }
}
