import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NewsService } from './news.service';

@Module({
  imports: [PrismaModule],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}


