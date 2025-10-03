import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { VendorsService } from './vendors.service';
import { CategoriesService } from './categories.service';
import { ProductsService } from './products.service';
import { VariantsService } from './variants.service';
import { InventoryService } from './inventory.service';
import { OptionsService } from './options.service';

@Module({
  imports: [PrismaModule],
  providers: [VendorsService, CategoriesService, ProductsService, VariantsService, InventoryService, OptionsService],
  exports: [VendorsService, CategoriesService, ProductsService, VariantsService, InventoryService, OptionsService],
})
export class CatalogModule {}


