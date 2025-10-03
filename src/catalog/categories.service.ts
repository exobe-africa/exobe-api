import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  createCategory(data: { name: string; slug: string; description?: string; parentId?: string; path: string; isActive?: boolean }) {
    return this.prisma.category.create({ data });
  }

  updateCategory(id: string, data: Partial<{ name: string; slug: string; description?: string; parentId?: string; path?: string; isActive?: boolean }>) {
    return this.prisma.category.update({ where: { id }, data });
  }

  listCategories() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async categoryTree() {
    const cats = await this.prisma.category.findMany();
    const byId = new Map<string, any>();
    cats.forEach((c) => byId.set(c.id, { ...c, children: [] as any[] }));
    const roots: any[] = [];
    for (const c of cats) {
      const node = byId.get(c.id);
      if (c.parent_id) {
        const parent = byId.get(c.parent_id);
        if (parent) parent.children.push(node);
        else roots.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }
}


