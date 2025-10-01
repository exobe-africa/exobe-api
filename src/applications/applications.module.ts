import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ApplicationsService } from './applications.service';

@Module({
  imports: [PrismaModule],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}


