import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  list(category?: string) {
    return this.prisma.newsArticle.findMany({
      where: category && category !== 'All' ? { category } : undefined,
      orderBy: { published_at: 'desc' },
    });
  }

  featured() {
    return this.prisma.newsArticle.findMany({
      where: { featured: true },
      orderBy: { published_at: 'desc' },
    });
  }

  byId(id: string) {
    return this.prisma.newsArticle.findUnique({ where: { id } });
  }

  create(data: any) {
    return this.prisma.newsArticle.create({
      data: {
        ...data,
        published_at: new Date(data.published_at),
      },
    });
  }

  update(id: string, data: any) {
    const updateData = { ...data } as any;
    if (data.published_at) updateData.published_at = new Date(data.published_at);
    return this.prisma.newsArticle.update({ where: { id }, data: updateData });
  }

  delete(id: string) {
    return this.prisma.newsArticle.delete({ where: { id } });
  }
}


