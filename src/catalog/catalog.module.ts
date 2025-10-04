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
import { WishlistsService } from '../catalog/wishlists.service';
import { ReviewsService } from '../catalog/reviews.service';
import { GiftCardsService } from './gift-cards.service';
import { DiscountsService } from './discounts.service';

@Module({
  imports: [PrismaModule],
  providers: [VendorsService, CategoriesService, ProductsService, VariantsService, InventoryService, OptionsService, OrdersService, ReturnsService, WishlistsService, ReviewsService, GiftCardsService, DiscountsService],
  exports: [VendorsService, CategoriesService, ProductsService, VariantsService, InventoryService, OptionsService, OrdersService, ReturnsService, WishlistsService, ReviewsService, GiftCardsService, DiscountsService],
})
export class CatalogModule {}


