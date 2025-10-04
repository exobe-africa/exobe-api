import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { ContactService } from './contact.service';

@Module({
  imports: [PrismaModule, EmailModule],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}


