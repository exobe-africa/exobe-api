import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService, private email: EmailService) {}

  sendMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    department?: string;
  }) {
    return this.prisma.contactMessage.create({ data }).then(async (saved) => {
      const subject = `[Contact] ${data.subject}`;
      
      await this.email.sendTemplatedEmail({
        to: process.env.CONTACT_TO_EMAIL || 'tech@exobe.africa',
        subject,
        template: 'contact-form',
        variables: {
          logoUrl: `${process.env.FRONTEND_URL || 'https://exobe.africa'}/logo.png`,
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          subject: data.subject,
          department: data.department || '',
          message: data.message,
          year: new Date().getFullYear(),
        },
        replyTo: data.email,
      });
      
      return saved;
    });
  }
}


