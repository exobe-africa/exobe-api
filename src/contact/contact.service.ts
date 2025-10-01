import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  sendMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    department?: string;
  }) {
    return this.prisma.contactMessage.create({ data });
  }
}


