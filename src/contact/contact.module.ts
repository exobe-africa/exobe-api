import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContactService } from './contact.service';

@Module({
  imports: [PrismaModule],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}


