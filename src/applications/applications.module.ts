import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { ApplicationsService } from './applications.service';

@Module({
  imports: [PrismaModule, EmailModule],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}


