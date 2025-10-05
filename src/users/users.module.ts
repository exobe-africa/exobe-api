import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { UsersService } from './users.service';
import { CustomerNotificationsService } from './customer-notifications.service';

@Module({
  imports: [PrismaModule, EmailModule],
  providers: [UsersService, CustomerNotificationsService],
  exports: [UsersService, CustomerNotificationsService],
})
export class UsersModule {}