import { Injectable } from '@nestjs/common';
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
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        agreeToTerms: data.agreeToTerms,
        subscribeNewsletter: data.subscribeNewsletter,
      },
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

  delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
