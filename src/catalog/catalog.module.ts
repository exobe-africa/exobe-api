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
import { CollectionsService } from './collections.service';
import { VendorNotificationsService } from './vendor-notifications.service';
import { EmailModule } from '../email/email.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [PrismaModule, EmailModule, StorageModule],
  providers: [VendorsService, CategoriesService, ProductsService, VariantsService, InventoryService, OptionsService, OrdersService, ReturnsService, WishlistsService, ReviewsService, GiftCardsService, DiscountsService, CollectionsService, VendorNotificationsService],
  exports: [VendorsService, CategoriesService, ProductsService, VariantsService, InventoryService, OptionsService, OrdersService, ReturnsService, WishlistsService, ReviewsService, GiftCardsService, DiscountsService, CollectionsService, VendorNotificationsService],
})
export class CatalogModule {}


