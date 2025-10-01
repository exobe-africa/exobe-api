import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  list(category?: string) {
    return this.prisma.newsArticle.findMany({
      where: category && category !== 'All' ? { category } : undefined,
      orderBy: { publishedAt: 'desc' },
    });
  }

  featured() {
    return this.prisma.newsArticle.findMany({
      where: { featured: true },
      orderBy: { publishedAt: 'desc' },
    });
  }

  byId(id: string) {
    return this.prisma.newsArticle.findUnique({ where: { id } });
  }
}


