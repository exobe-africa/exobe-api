import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { SupabaseStorageService } from '../storage/supabase-storage.service';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private supabaseStorage: SupabaseStorageService,
  ) {}

  async createProduct(data: any, currentUserId: string, requireOwnership = true) {
    if (requireOwnership) {
      const vendor = await this.prisma.vendor.findUnique({ where: { id: data.vendor_id } });
      if (!vendor) throw new NotFoundException('Vendor not found');
      const currentUser = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (vendor.owner_user_id !== currentUserId && currentUser?.role !== 'ADMIN') {
        throw new ForbiddenException('Not vendor owner');
      }
    }
    const createData: any = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      features: data.features ?? [],
      availableLocations: data.availableLocations ?? [],
      is_active: data.is_active,
      featured: data.featured,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      delivery_min_days: data.deliveryMinDays,
      delivery_max_days: data.deliveryMaxDays,
      weight: data.weight,
      weight_unit: data.weightUnit,
      length: data.length,
      width: data.width,
      height: data.height,
      dimension_unit: data.dimensionUnit,
      product_type: data.productType || 'GENERAL',
      brand: data.brand,
      model: data.model,
      material: data.material,
      vendor: { connect: { id: data.vendor_id } },
      category: { connect: { id: data.categoryId } },
    };
    if (data.status) createData.status = data.status as ProductStatus;
    const created = await this.prisma.catalogProduct.create({ data: createData });

    // Write normalized detail tables based on product_type
    // Books/eBooks
    if (['BOOK', 'EBOOK'].includes(createData.product_type)) {
      await this.prisma.productBookDetails.create({
        data: {
          product_id: created.id,
          isbn: data.isbn ?? null,
          author: data.author ?? null,
          publisher: data.publisher ?? null,
          publication_date: data.publicationDate ? new Date(data.publicationDate) : null,
          pages: data.pages ?? null,
          language: data.language ?? null,
          genre: data.genre ?? null,
          format: data.format ?? null,
        },
      });
    }

    // Consumables (FOOD, BEVERAGE, HEALTH, PET, BEAUTY)
    if (['FOOD', 'BEVERAGE', 'HEALTH', 'PET', 'BEAUTY'].includes(createData.product_type)) {
      // Parse ingredients if it's a JSON string (array format from frontend)
      let ingredientsData = null;
      if (data.ingredients) {
        try {
          ingredientsData = typeof data.ingredients === 'string' ? JSON.parse(data.ingredients) : data.ingredients;
        } catch (e) {
          // If parsing fails, store as plain text
          ingredientsData = data.ingredients;
        }
      }
      
      // Parse nutritionalInfo only if it's a valid JSON string, otherwise store as null
      let nutritionalData = null;
      if (data.nutritionalInfo) {
        try {
          nutritionalData = typeof data.nutritionalInfo === 'string' ? JSON.parse(data.nutritionalInfo) : data.nutritionalInfo;
        } catch (e) {
          // If parsing fails, just skip nutritional info
          nutritionalData = null;
        }
      }
      
      await this.prisma.productConsumableDetails.create({
        data: {
          product_id: created.id,
          expiry_date: data.expiryDate ? new Date(data.expiryDate) : null,
          ingredients: ingredientsData,
          nutritional_info: nutritionalData,
        },
      });
    }

    // Electronics
    if (createData.product_type === 'ELECTRONICS') {
      await this.prisma.productElectronicsDetails.create({
        data: {
          product_id: created.id,
          warranty_period: data.warrantyPeriod ?? null,
          energy_rating: data.energyRating ?? null,
        },
      });
    }

    // Media (MUSIC, ART)
    if (['MUSIC', 'ART'].includes(createData.product_type)) {
      await this.prisma.productMediaDetails.create({
        data: {
          product_id: created.id,
          artist: data.artist ?? null,
          genre: data.genre ?? null,
          format: data.format ?? null,
          release_at: data.publicationDate ? new Date(data.publicationDate) : null,
        },
      });
    }

    // Software
    if (createData.product_type === 'SOFTWARE') {
      await this.prisma.productSoftwareDetails.create({
        data: {
          product_id: created.id,
          platform: data.platform ?? null,
          license_type: data.licenseType ?? null,
        },
      });
    }

    // Service
    if (createData.product_type === 'SERVICE') {
      await this.prisma.productServiceDetails.create({
        data: {
          product_id: created.id,
          service_duration: data.serviceDuration ?? null,
        },
      });
    }

    // Compliance (age rating, certifications) — applicable to many
    if (data.ageRating || data.certification) {
      await this.prisma.productComplianceDetails.create({
        data: {
          product_id: created.id,
          age_rating: data.ageRating ?? null,
          certification: data.certification ?? null,
        },
      });
    }
    if (Array.isArray(data.mediaUploads) && data.mediaUploads.length > 0) {
      for (const [idx, m] of data.mediaUploads.entries()) {
        if (!m?.base64 || !m?.filename) continue;
        const buf = Buffer.from(m.base64.split(',').pop() || m.base64, 'base64');
        const path = `products/${created.id}/${Date.now()}-${m.filename}`;
        const uploaded = await this.storage.uploadFileFromBuffer(path, buf, m.contentType || undefined);
        await this.prisma.productMedia.create({
          data: {
            product_id: created.id,
            url: uploaded.publicUrl,
            type: (m.type as any) ?? undefined,
            position: m.position ?? idx,
          },
        });
      }
    }
    return created;
  }

  async updateProduct(id: string, data: any, currentUserId: string, requireOwnership = true) {
    if (requireOwnership) {
      const product = await this.prisma.catalogProduct.findUnique({ where: { id } });
      if (!product) throw new NotFoundException('Product not found');
      const vendor = await this.prisma.vendor.findUnique({ where: { id: product.vendor_id } });
      const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (!vendor || (vendor.owner_user_id !== currentUserId && user?.role !== 'ADMIN')) throw new ForbiddenException('Not vendor owner');
    }
    const updateData: any = { ...data };
    if (data.features) updateData.features = data.features;
    if (data.availableLocations) updateData.availableLocations = data.availableLocations;
    if (data.deliveryMinDays !== undefined) updateData.delivery_min_days = data.deliveryMinDays;
    if (data.deliveryMaxDays !== undefined) updateData.delivery_max_days = data.deliveryMaxDays;
    if (data.weight !== undefined) updateData.weight = data.weight;
    if (data.weightUnit) updateData.weight_unit = data.weightUnit;
    if (data.length !== undefined) updateData.length = data.length;
    if (data.width !== undefined) updateData.width = data.width;
    if (data.height !== undefined) updateData.height = data.height;
    if (data.dimensionUnit) updateData.dimension_unit = data.dimensionUnit;
    if (data.productType) updateData.product_type = data.productType;
    if (data.brand) updateData.brand = data.brand;
    if (data.model) updateData.model = data.model;
    if (data.material) updateData.material = data.material;
    if (data.category_id) {
      updateData.category = { connect: { id: data.category_id } };
      delete updateData.categoryId;
    }
    if (data.status) updateData.status = data.status as ProductStatus;
    const updated = await this.prisma.catalogProduct.update({ where: { id }, data: updateData });

    // Upsert normalized tables
    // Books/eBooks
    if (['BOOK', 'EBOOK'].includes(updateData.product_type) || data.isbn || data.author || data.publisher || data.pages || data.language || data.genre || data.format || data.publicationDate) {
      const exists = await this.prisma.productBookDetails.findUnique({ where: { product_id: id } as any });
      const payload: any = {
        product_id: id,
        isbn: data.isbn ?? undefined,
        author: data.author ?? undefined,
        publisher: data.publisher ?? undefined,
        publication_date: data.publicationDate ? new Date(data.publicationDate) : undefined,
        pages: data.pages ?? undefined,
        language: data.language ?? undefined,
        genre: data.genre ?? undefined,
        format: data.format ?? undefined,
      };
      if (exists) await this.prisma.productBookDetails.update({ where: { id: exists.id }, data: payload });
      else await this.prisma.productBookDetails.create({ data: payload });
    }

    // Consumables
    if (['FOOD', 'BEVERAGE', 'HEALTH', 'PET', 'BEAUTY'].includes(updateData.product_type) || data.expiryDate || data.ingredients || data.nutritionalInfo) {
      const exists = await this.prisma.productConsumableDetails.findUnique({ where: { product_id: id } as any });
      
      // Parse ingredients if it's a JSON string (array format from frontend)
      let ingredientsData = undefined;
      if (data.ingredients) {
        try {
          ingredientsData = typeof data.ingredients === 'string' ? JSON.parse(data.ingredients) : data.ingredients;
        } catch (e) {
          // If parsing fails, store as plain text
          ingredientsData = data.ingredients;
        }
      }
      
      // Parse nutritionalInfo safely
      let nutritionalData = undefined;
      if (data.nutritionalInfo) {
        try {
          nutritionalData = typeof data.nutritionalInfo === 'string' ? JSON.parse(data.nutritionalInfo) : data.nutritionalInfo;
        } catch (e) {
          nutritionalData = undefined;
        }
      }
      
      const payload: any = {
        product_id: id,
        expiry_date: data.expiryDate ? new Date(data.expiryDate) : undefined,
        ingredients: ingredientsData,
        nutritional_info: nutritionalData,
      };
      if (exists) await this.prisma.productConsumableDetails.update({ where: { id: exists.id }, data: payload });
      else await this.prisma.productConsumableDetails.create({ data: payload });
    }

    // Electronics
    if (updateData.product_type === 'ELECTRONICS' || data.warrantyPeriod !== undefined || data.energyRating) {
      const exists = await this.prisma.productElectronicsDetails.findUnique({ where: { product_id: id } as any });
      const payload: any = {
        product_id: id,
        warranty_period: data.warrantyPeriod ?? undefined,
        energy_rating: data.energyRating ?? undefined,
      };
      if (exists) await this.prisma.productElectronicsDetails.update({ where: { id: exists.id }, data: payload });
      else await this.prisma.productElectronicsDetails.create({ data: payload });
    }

    // Media
    if (['MUSIC', 'ART'].includes(updateData.product_type) || data.artist || data.genre || data.format || data.publicationDate) {
      const exists = await this.prisma.productMediaDetails.findUnique({ where: { product_id: id } as any });
      const payload: any = {
        product_id: id,
        artist: data.artist ?? undefined,
        genre: data.genre ?? undefined,
        format: data.format ?? undefined,
        release_at: data.publicationDate ? new Date(data.publicationDate) : undefined,
      };
      if (exists) await this.prisma.productMediaDetails.update({ where: { id: exists.id }, data: payload });
      else await this.prisma.productMediaDetails.create({ data: payload });
    }

    // Software
    if (updateData.product_type === 'SOFTWARE' || data.platform || data.licenseType) {
      const exists = await this.prisma.productSoftwareDetails.findUnique({ where: { product_id: id } as any });
      const payload: any = {
        product_id: id,
        platform: data.platform ?? undefined,
        license_type: data.licenseType ?? undefined,
      };
      if (exists) await this.prisma.productSoftwareDetails.update({ where: { id: exists.id }, data: payload });
      else await this.prisma.productSoftwareDetails.create({ data: payload });
    }

    // Compliance
    if (data.ageRating || data.certification) {
      const exists = await this.prisma.productComplianceDetails.findUnique({ where: { product_id: id } as any });
      const payload: any = {
        product_id: id,
        age_rating: data.ageRating ?? undefined,
        certification: data.certification ?? undefined,
      };
      if (exists) await this.prisma.productComplianceDetails.update({ where: { id: exists.id }, data: payload });
      else await this.prisma.productComplianceDetails.create({ data: payload });
    }
    if (Array.isArray(data.mediaUploads) && data.mediaUploads.length > 0) {
      for (const [idx, m] of data.mediaUploads.entries()) {
        if (!m?.base64 || !m?.filename) continue;
        const buf = Buffer.from(m.base64.split(',').pop() || m.base64, 'base64');
        const path = `products/${id}/${Date.now()}-${m.filename}`;
        const uploaded = await this.storage.uploadFileFromBuffer(path, buf, m.contentType || undefined);
        await this.prisma.productMedia.create({
          data: {
            product_id: id,
            url: uploaded.publicUrl,
            type: (m.type as any) ?? undefined,
            position: m.position ?? idx,
          },
        });
      }
    }
    return updated;
  }

  async deleteProduct(id: string, currentUserId: string, requireOwnership = true) {
    if (requireOwnership) {
      const product = await this.prisma.catalogProduct.findUnique({ where: { id } });
      if (!product) throw new NotFoundException('Product not found');
      const vendor = await this.prisma.vendor.findUnique({ where: { id: product.vendor_id } });
      const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (!vendor || (vendor.owner_user_id !== currentUserId && user?.role !== 'ADMIN')) throw new ForbiddenException('Not vendor owner');
    }
    await this.prisma.productVariant.deleteMany({ where: { product_id: id } });
    await this.prisma.productMedia.deleteMany({ where: { product_id: id } });
    await this.prisma.catalogProduct.delete({ where: { id } });
    return true;
  }

  getProductById(id: string) {
    return this.prisma.catalogProduct.findUnique({
      where: { id },
      include: ({} as any).constructor({
        variants: true,
        media: true,
        vendor: true,
        category: true,
        options: { include: { values: true } },
      }),
    });
  }

  listProductsByVendor(vendor_id: string) {
    return this.prisma.catalogProduct.findMany({ where: { vendor_id }, orderBy: { created_at: 'desc' } });
  }

  async listProductsPaged(params: any) {
    const { query, category_id, vendor_id, status, is_active, cursor, limit = 20 } = params;
    const where: any = {};
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }
    if (category_id) where.category_id = category_id;
    if (vendor_id) where.vendor_id = vendor_id;
    if (typeof is_active === 'boolean') where.is_active = is_active;
    if (status) where.status = status as ProductStatus;

    const results = await this.prisma.catalogProduct.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
    });
    let nextCursor: string | null = null;
    if (results.length > limit) {
      const next = results.pop();
      nextCursor = next!.id;
    }
    return { items: results, nextCursor };
  }

  approveProduct(product_id: string) {
    return this.prisma.catalogProduct.update({ where: { id: product_id }, data: { status: 'ACTIVE', is_active: true } });
  }
  archiveProduct(product_id: string) {
    return this.prisma.catalogProduct.update({ where: { id: product_id }, data: { status: 'ARCHIVED', is_active: false } });
  }

  async addProductMedia(product_id: string, data: any, currentUserId: string) {
    let url = data.url as string | undefined;
    if (!url && data.base64 && data.filename) {
      const buf = Buffer.from((data.base64 as string).split(',').pop() || data.base64, 'base64');
      const path = `products/${product_id}/${Date.now()}-${data.filename}`;
      const uploaded = await this.storage.uploadFileFromBuffer(path, buf, data.contentType || undefined);
      url = uploaded.publicUrl;
    }
    if (!url) throw new Error('Either url or base64+filename must be provided');
    return this.prisma.productMedia.create({ data: { product_id, url, type: (data.type as any) ?? undefined, position: data.position ?? 0 } });
  }
  removeProductMedia(mediaId: string, currentUserId: string) {
    return this.prisma.productMedia.delete({ where: { id: mediaId } }).then(() => true);
  }
}


