import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscribeEmailInput } from '../graphql/dto/email-subscription.input';

@Injectable()
export class EmailSubscriptionService {
  constructor(private prisma: PrismaService) {}

  async subscribeToNewsletter(input: SubscribeEmailInput) {
    try {
      const existingSubscription = await this.prisma.emailSubscription.findUnique({
        where: { email: input.email },
      });

      if (existingSubscription) {
        if (existingSubscription.is_active) {
          throw new ConflictException('This email is already subscribed to the newsletter.');
        } else {
          return await this.prisma.emailSubscription.update({
            where: { email: input.email },
            data: { is_active: true },
          });
        }
      }

      return await this.prisma.emailSubscription.create({
        data: {
          email: input.email,
          is_active: true,
        },
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to subscribe to newsletter. Please try again.');
    }
  }

  async unsubscribeFromNewsletter(email: string) {
    const subscription = await this.prisma.emailSubscription.findUnique({
      where: { email },
    });

    if (!subscription) {
      throw new BadRequestException('Email address not found in subscription list.');
    }

    return await this.prisma.emailSubscription.update({
      where: { email },
      data: { is_active: false },
    });
  }

  async getAllSubscriptions() {
    return await this.prisma.emailSubscription.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async getSubscriptionByEmail(email: string) {
    return await this.prisma.emailSubscription.findUnique({
      where: { email },
    });
  }
}
