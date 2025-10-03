import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { VendorsService } from './vendors.service';
import { CategoriesService } from './categories.service';
import { ProductsService } from './products.service';
import { VariantsService } from './variants.service';
import { InventoryService } from './inventory.service';
import { OptionsService } from './options.service';
import { OrdersService } from '../catalog/orders.service';
import { ReturnsService } from '../catalog/returns.service';

@Module({
  imports: [PrismaModule],
  providers: [VendorsService, CategoriesService, ProductsService, VariantsService, InventoryService, OptionsService, OrdersService, ReturnsService],
  exports: [VendorsService, CategoriesService, ProductsService, VariantsService, InventoryService, OptionsService, OrdersService, ReturnsService],
})
export class CatalogModule {}


