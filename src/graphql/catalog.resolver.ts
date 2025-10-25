import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VendorsService } from '../catalog/vendors.service';
import { CategoriesService } from '../catalog/categories.service';
import { ProductsService } from '../catalog/products.service';
import { VariantsService } from '../catalog/variants.service';
import { InventoryService } from '../catalog/inventory.service';
import { OptionsService } from '../catalog/options.service';
import { UsersService } from '../users/users.service';
import { OrdersService } from '../catalog/orders.service';
import { AdminDashboardService } from '../catalog/admin-dashboard.service';
import { VendorType, CategoryType, ProductType, ProductVariantType, ProductMediaType, CategoryTreeType, ProductOptionType, UserAddressType, OrderType, VatRateType, ReturnRequestType, WishlistType, ReviewType, CustomerNotificationSettingsType, GiftCardType, DiscountTypeGQL, CollectionType, VendorNotificationSettingsType, CustomerType, OrderDiscountType } from './types/catalog.types';
import { DashboardStatsType, RecentOrderType } from './types/admin-dashboard.types';
import { CreateVendorInput, CreateCategoryInput, CreateProductInput, UpdateProductInput, CreateVariantInput, UpdateVariantInput, attributesArrayToRecord, InventoryAdjustInput, AddVariantMediaInput, AddProductMediaInput, BulkCreateVariantsInput, CreateProductOptionInput, AddOptionValueInput, CreateUserAddressInput, UpdateUserAddressInput, CreateOrderInput, UpdateOrderInput, RequestReturnInput, WishlistItemInput, CreateReviewInput, UpdateReviewInput, UpdateNotificationSettingsInput, UpdateProfileInput, UpdatePasswordInput, CheckEmailExistsInput, CreateGiftCardInput, UpdateGiftCardInput, CreateDiscountInput, UpdateDiscountInput, CreateCollectionInput, UpdateCollectionInput, ModifyCollectionProductsInput, UpdateVendorNotificationSettingsInput } from './dto/catalog.inputs';
import { ReturnsService } from '../catalog/returns.service';
import { WishlistsService } from '../catalog/wishlists.service';
import { ReviewsService } from '../catalog/reviews.service';
import { GiftCardsService } from '../catalog/gift-cards.service';
import { DiscountsService } from '../catalog/discounts.service';
import { CollectionsService } from '../catalog/collections.service';
import { VendorNotificationsService } from '../catalog/vendor-notifications.service';
import { DocumentsService } from '../catalog/documents.service';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Resolver()
export class CatalogResolver {
  constructor(
    private vendors: VendorsService,
    private categoriesService: CategoriesService,
    private products: ProductsService,
    private variants: VariantsService,
    private inventory: InventoryService,
    private options: OptionsService,
    private users: UsersService,
    private orders: OrdersService,
    private returns: ReturnsService,
    private wishlists: WishlistsService,
    private reviews: ReviewsService,
    private giftcards: GiftCardsService,
    private discounts: DiscountsService,
    private collections: CollectionsService,
    private vendorNotifs: VendorNotificationsService,
    private documents: DocumentsService,
    private dashboard: AdminDashboardService,
  ) {}

  private toProductType(record: any): ProductType {
    if (!record) return record;
    return {
      id: record.id,
      vendorId: record.vendorId ?? record.vendor_id,
      categoryId: record.categoryId ?? record.category_id,
      title: record.title,
      slug: record.slug,
      description: record.description ?? undefined,
      status: record.status,
      isActive: Boolean(record.isActive ?? record.is_active),
      featured: Boolean(record.featured),
      features: record.features ?? undefined,
      availableLocations: record.availableLocations ?? record.available_locations ?? undefined,
      variants: Array.isArray(record.variants) ? record.variants.map((v: any) => ({
        id: v.id,
        sku: v.sku,
        title: v.title,
        priceCents: v.price_cents ?? v.priceCents,
        compareAtPriceCents: v.compare_at_price_cents ?? v.compareAtPriceCents,
        barcode: v.barcode,
        weightGrams: v.weight_grams ?? v.weightGrams,
        stockQuantity: v.stock_quantity ?? v.stockQuantity,
        attributes: typeof v.attributes === 'object' ? v.attributes : {},
        availableLocations: v.availableLocations ?? [],
        media: Array.isArray(record.media) ? record.media.map((m:any)=>({ id: m.id, url: m.url, type: m.type, position: m.position })) : undefined,
      })) : undefined,
      options: Array.isArray(record.options) ? record.options.map((o: any) => ({
        id: o.id,
        name: o.name,
        position: o.position,
        values: Array.isArray(o.values) ? o.values.map((val: any) => ({ id: val.id, value: val.value, position: val.position })) : [],
      })) : undefined,
      productType: record.product_type ?? record.productType,
      deliveryMinDays: record.delivery_min_days ?? record.deliveryMinDays,
      deliveryMaxDays: record.delivery_max_days ?? record.deliveryMaxDays,
      weight: record.weight ?? undefined,
      weightUnit: record.weight_unit ?? record.weightUnit,
      length: record.length ?? undefined,
      width: record.width ?? undefined,
      height: record.height ?? undefined,
      dimensionUnit: record.dimension_unit ?? record.dimensionUnit,
      tags: record.tags ?? undefined,
      priceInCents: record.price_in_cents ?? record.priceInCents,
      compareAtPriceInCents: record.compare_at_price_in_cents ?? record.compareAtPriceInCents,
      stockQuantity: record.stock_quantity ?? record.stockQuantity ?? undefined,
      media: Array.isArray(record.media) ? record.media.map((m: any) => ({
        id: m.id,
        url: m.url,
        type: m.type,
        position: m.position,
      })) : undefined,
      pickupLocation: record.pickup_location ? {
        id: record.pickup_location.id,
        name: record.pickup_location.name,
        address: record.pickup_location.address,
        city: record.pickup_location.city,
        province: record.pickup_location.province,
        postalCode: record.pickup_location.postal_code,
        country: record.pickup_location.country,
        instructions: record.pickup_location.instructions,
      } : undefined,
      returnPolicy: record.return_policy ? {
        id: record.return_policy.id,
        name: record.return_policy.name,
        returnsAccepted: record.return_policy.returns_accepted,
        returnPeriodDays: record.return_policy.return_period_days,
        returnConditions: record.return_policy.return_conditions,
        restockingFeePct: record.return_policy.restocking_fee_pct,
        returnShippingPaidBy: record.return_policy.return_shipping_paid_by,
      } : undefined,
      warranty: record.warranty ? {
        id: record.warranty.id,
        hasWarranty: record.warranty.has_warranty,
        warrantyPeriod: record.warranty.warranty_period,
        warrantyUnit: record.warranty.warranty_unit,
        warrantyDetails: record.warranty.warranty_details,
      } : undefined,
      bookDetails: record.book_details ? {
        id: record.book_details.id,
        isbn: record.book_details.isbn,
        author: record.book_details.author,
        publisher: record.book_details.publisher,
        publicationDate: record.book_details.publication_date,
        pages: record.book_details.pages,
        language: record.book_details.language,
        genre: record.book_details.genre,
        format: record.book_details.format,
      } : undefined,
      consumableDetails: record.consumable_details ? {
        id: record.consumable_details.id,
        expiryDate: record.consumable_details.expiry_date,
        ingredients: record.consumable_details.ingredients,
        allergens: record.consumable_details.allergens,
        nutritionalInfo: record.consumable_details.nutritional_info,
      } : undefined,
      electronicsDetails: record.electronics_details ? {
        id: record.electronics_details.id,
        energyRating: record.electronics_details.energy_rating,
      } : undefined,
      mediaDetails: record.media_details ? {
        id: record.media_details.id,
        artist: record.media_details.artist,
        genre: record.media_details.genre,
        format: record.media_details.format,
        releaseAt: record.media_details.release_at,
      } : undefined,
      softwareDetails: record.software_details ? {
        id: record.software_details.id,
        platform: record.software_details.platform,
        licenseType: record.software_details.license_type,
      } : undefined,
      serviceDetails: record.service_details ? {
        id: record.service_details.id,
        serviceDuration: record.service_details.service_duration,
      } : undefined,
      complianceDetails: record.compliance_details ? {
        id: record.compliance_details.id,
        ageRating: record.compliance_details.age_rating,
        certification: record.compliance_details.certification,
      } : undefined,
      salesCount: Array.isArray(record.order_items) ? record.order_items.length : (record._count?.order_items ?? 0),
      category: record.category ? {
        id: record.category.id,
        name: record.category.name,
        slug: record.category.slug,
        description: record.category.description,
        parentId: record.category.parent_id,
        path: record.category.path,
        isActive: Boolean(record.category.is_active),
      } : undefined,
    } as unknown as ProductType;
  }
  private toUserAddressType(record: any): UserAddressType {
    if (!record) return record;
    return {
      id: record.id,
      type: record.type,
      addressName: record.addressName ?? record.address_name,
      addressLine1: record.addressLine1 ?? record.address_line1,
      addressLine2: record.addressLine2 ?? record.address_line2 ?? null,
      city: record.city,
      province: record.province ?? null,
      country: record.country,
      postalCode: record.postalCode ?? record.postal_code,
      defaultAddress: !!(record.defaultAddress ?? record.default_address),
    } as unknown as UserAddressType;
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Mutation(() => VendorType)
  createVendor(@Args('input') input: CreateVendorInput, @Context() ctx: any) {
    return this.vendors.createVendor({ ...input, ownerUser_id: ctx.req.user.userId });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Mutation(() => CategoryType)
  createCategory(@Args('input') input: CreateCategoryInput) {
    return this.categoriesService.createCategory(input);
  }

  @Query(() => [CategoryType])
  categories() {
    return this.categoriesService.listCategories();
  }

  @Query(() => [CategoryTreeType])
  categoryTree() {
    return this.categoriesService.categoryTree();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN', 'SUPER_ADMIN')
  @Mutation(() => ProductType)
  async createProduct(@Args('input') input: CreateProductInput, @Context() ctx: any) {
    const created = await this.products.createProduct(input, ctx.req.user.userId, true);
    return this.toProductType(created);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN', 'SUPER_ADMIN')
  @Mutation(() => ProductType)
  async updateProduct(
    @Args('id') id: string,
    @Args('input') input: UpdateProductInput,
    @Context() ctx: any,
  ) {
    const updated = await this.products.updateProduct(id, input, ctx.req.user.userId, true);
    return this.toProductType(updated);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN', 'SUPER_ADMIN')
  @Mutation(() => Boolean)
  deleteProduct(@Args('id') id: string, @Context() ctx: any) {
    return this.products.deleteProduct(id, ctx.req.user.userId, true);
  }

  @Query(() => ProductType, { nullable: true })
  async productById(@Args('id') id: string) {
    const product = await this.products.getProductById(id);
    return this.toProductType(product);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN', 'SUPER_ADMIN')
  @Mutation(() => ProductVariantType)
  createVariant(@Args('input') input: CreateVariantInput, @Context() ctx: any) {
    const attributes = attributesArrayToRecord(input.attributes);
    return this.variants.createVariant({ ...input, attributes }, ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN', 'SUPER_ADMIN')
  @Mutation(() => [ProductVariantType])
  bulkCreateVariants(@Args('input') input: BulkCreateVariantsInput, @Context() ctx: any) {
    const mapped = input.variants.map(v => ({ ...v, attributes: attributesArrayToRecord(v.attributes) }));
    return this.variants.bulkCreateVariants(input.productId, mapped as any, ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN', 'SUPER_ADMIN')
  @Mutation(() => ProductOptionType)
  createProductOption(@Args('input') input: CreateProductOptionInput, @Context() ctx: any) {
    return this.options.createOption(input.productId, input.name, input.position ?? 0, ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN', 'SUPER_ADMIN')
  @Mutation(() => ProductOptionType)
  addOptionValue(@Args('input') input: AddOptionValueInput, @Context() ctx: any) {
    return this.options.addOptionValue(input.optionId, input.value, input.position ?? 0, ctx.req.user.userId);
  }

  @Query(() => [ProductOptionType])
  productOptions(@Args('productId') productId: string) {
    return this.options.listOptions(productId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN', 'SUPER_ADMIN')
  @Mutation(() => ProductVariantType)
  updateVariant(
    @Args('id') id: string,
    @Args('input') input: UpdateVariantInput,
    @Context() ctx: any,
  ) {
    const data: any = { ...input };
    if (input.attributes) data.attributes = attributesArrayToRecord(input.attributes);
    return this.variants.updateVariant(id, data, ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN', 'SUPER_ADMIN')
  @Mutation(() => Boolean)
  deleteVariant(@Args('id') id: string, @Context() ctx: any) {
    return this.variants.deleteVariant(id, ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN', 'SUPER_ADMIN')
  @Mutation(() => String)
  adjustInventory(@Args('input') input: InventoryAdjustInput, @Context() ctx: any) {
    return this.inventory
      .adjustInventory(input.variantId, input.change, input.reason, input.notes, ctx.req.user.userId)
      .then((r) => JSON.stringify(r));
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN', 'SUPER_ADMIN')
  @Mutation(() => ProductMediaType)
  addVariantMedia(@Args('input') input: AddVariantMediaInput, @Context() ctx: any) {
    return this.variants.addVariantMedia(
      input.variantId,
      { url: input.url, base64: input.base64, filename: input.filename, contentType: input.contentType, type: input.type, position: input.position },
      ctx.req.user.userId,
    );
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN', 'SUPER_ADMIN')
  @Mutation(() => Boolean)
  removeVariantMedia(@Args('mediaId') mediaId: string, @Context() ctx: any) {
    return this.variants.removeVariantMedia(mediaId, ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN', 'SUPER_ADMIN')
  @Mutation(() => ProductMediaType)
  addProductMedia(@Args('input') input: AddProductMediaInput, @Context() ctx: any) {
    return this.products.addProductMedia(
      input.productId,
      { url: input.url, base64: input.base64, filename: input.filename, contentType: input.contentType, type: input.type, position: input.position },
      ctx.req.user.userId,
    );
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN', 'SUPER_ADMIN')
  @Mutation(() => Boolean)
  removeProductMedia(@Args('mediaId') mediaId: string, @Context() ctx: any) {
    return this.products.removeProductMedia(mediaId, ctx.req.user.userId);
  }

  @Query(() => String)
  searchProducts(
    @Args('query', { nullable: true }) query?: string,
    @Args('categoryId', { nullable: true }) categoryId?: string,
    @Args('vendorId', { nullable: true }) vendorId?: string,
    @Args('status', { nullable: true }) status?: string,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('cursor', { nullable: true }) cursor?: string,
    @Args('limit', { nullable: true }) limit?: number,
  ) {
    return this.products
      .listProductsPaged({ query, categoryId, vendorId, status, isActive, cursor, limit })
      .then((r) => {
        const transformedItems = r.items.map((item: any) => this.toProductType(item));
        return JSON.stringify({ ...r, items: transformedItems });
      });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Mutation(() => Boolean)
  approveVendor(@Args('vendorId') vendor_id: string) {
    return this.vendors.approveVendor(vendor_id).then(() => true);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Mutation(() => Boolean)
  suspendVendor(@Args('vendorId') vendor_id: string) {
    return this.vendors.suspendVendor(vendor_id).then(() => true);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Mutation(() => Boolean)
  approveProduct(@Args('productId') product_id: string) {
    return this.products.approveProduct(product_id).then(() => true);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Mutation(() => Boolean)
  archiveProduct(@Args('productId') product_id: string) {
    return this.products.archiveProduct(product_id).then(() => true);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserAddressType)
  async createUserAddress(@Args('input') input: CreateUserAddressInput, @Context() ctx: any) {
    const currentUserId = ctx.req.user.userId as string;
    const sanitized: CreateUserAddressInput = {
      userId: input.userId,
      type: input.type,
      addressName: input.addressName,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2,
      city: input.city,
      province: input.province,
      country: input.country,
      postalCode: input.postalCode,
      defaultAddress: input.defaultAddress,
    };

    try {
      const created = await this.users.createAddress(sanitized as any, currentUserId);
      return this.toUserAddressType(created);
    } catch (e: any) {
      throw new BadRequestException(e?.message || 'Invalid address input');
    }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserAddressType)
  async updateUserAddress(
    @Args('id') id: string,
    @Args('input') input: UpdateUserAddressInput,
    @Context() ctx: any,
  ) {
    const currentUserId = ctx.req.user.userId as string;
    const sanitized: UpdateUserAddressInput = {
      type: input.type,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2,
      city: input.city,
      province: input.province,
      country: input.country,
      postalCode: input.postalCode,
    };
    
    try {
      const updated = await this.users.updateAddress(id, sanitized as any, currentUserId);
      return this.toUserAddressType(updated);
    } catch (e: any) {
      throw new BadRequestException(e?.message || 'Invalid address input');
    }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  deleteUserAddress(@Args('id') id: string, @Context() ctx: any) {
    return this.users.deleteAddress(id, ctx.req.user.userId);
  }

  @Query(() => [UserAddressType])
  async getUserAddresses(@Args('userId') userId: string) {
    const rows = await this.users.getUserAddresses(userId);
    return rows.map(r => this.toUserAddressType(r));
  }

  @Mutation(() => OrderType)
  createOrder(@Args('input') input: CreateOrderInput, @Context() ctx: any) {
    const userId = ctx?.req?.user?.userId as string | undefined;
    return this.orders.createOrder({ ...input, userId });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Mutation(() => OrderType)
  updateOrder(@Args('orderId') orderId: string, @Args('input') input: UpdateOrderInput, @Context() ctx: any) {
    const userId = ctx?.req?.user?.userId as string | undefined;
    return this.orders.updateOrder(orderId, input as any, userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Mutation(() => Boolean)
  deleteOrder(@Args('orderId') orderId: string) {
    return this.orders.deleteOrder(orderId);
  }

  @Query(() => [VatRateType])
  vatRates(@Args('country', { nullable: true }) country?: string) {
    return this.orders.getVatRates(country);
  }

  @Query(() => OrderType)
  trackOrder(@Args('orderNumber') orderNumber: string, @Args('email') email: string) {
    return this.orders.trackOrder(orderNumber, email);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [OrderType])
  myOrders(@Context() ctx: any) {
    return this.orders.myOrders(ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Query(() => [OrderType], { name: 'orders' })
  adminOrders(
    @Args('status', { nullable: true }) status?: string,
    @Args('query', { nullable: true }) query?: string,
    @Args('take', { nullable: true }) take?: number,
    @Args('skip', { nullable: true }) skip?: number,
  ) {
    return (this.orders as any).listOrders({ status, query, take, skip });
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => OrderType)
  orderById(@Args('orderId') orderId: string, @Context() ctx: any) {
    const role = ctx.req.user.role;
    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
    return this.orders.getOrderById(orderId, ctx.req.user.userId, isAdmin);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ReturnRequestType)
  requestReturn(@Args('input') input: RequestReturnInput, @Context() ctx: any) {
    return this.returns.requestReturn({ ...input, userId: ctx.req.user.userId } as any);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ReturnRequestType])
  myReturns(@Context() ctx: any) {
    return this.returns.myReturns(ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => ReturnRequestType)
  returnById(@Args('id') id: string, @Context() ctx: any) {
    const role = ctx.req.user.role;
    const isAdmin = role === 'ADMIN';
    return this.returns.returnById(id, ctx.req.user.userId, isAdmin);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Mutation(() => ReturnRequestType)
  updateReturnStatus(@Args('id') id: string, @Args('status') status: string, @Args('description', { nullable: true }) description?: string) {
    return this.returns.updateReturnStatus(id, status, description);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => WishlistType, { nullable: true })
  myWishlist(@Context() ctx: any) {
    return this.wishlists.getWishlist(ctx.req.user.userId).then((wl) => wl ? { ...wl, count: wl.items?.length ?? 0 } : null);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  addToWishlist(@Args('input') input: WishlistItemInput, @Context() ctx: any) {
    return this.wishlists.addToWishlist(ctx.req.user.userId, input).then(() => true);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  removeFromWishlist(@Args('input') input: WishlistItemInput, @Context() ctx: any) {
    return this.wishlists.removeFromWishlist(ctx.req.user.userId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => CustomerNotificationSettingsType)
  myNotificationSettings(@Context() ctx: any) {
    return this.users.getNotificationSettings(ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CustomerNotificationSettingsType)
  updateMyNotificationSettings(@Args('input') input: UpdateNotificationSettingsInput, @Context() ctx: any) {
    const sanitizedInput = {
      order_confirmations: input.order_confirmations ?? true,
      shipping_updates: input.shipping_updates ?? true,
      delivery_notifications: input.delivery_notifications ?? true,
      product_recommendations: input.product_recommendations ?? false,
      exclusive_deals: input.exclusive_deals ?? false,
      wishlist_updates: input.wishlist_updates ?? false,
      shopping_insights: input.shopping_insights ?? false,
      login_alerts: input.login_alerts ?? true,
      password_changes: input.password_changes ?? true,
    };
    return this.users.updateNotificationSettings(ctx.req.user.userId, sanitizedInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  updateMyProfile(@Args('input') input: UpdateProfileInput, @Context() ctx: any) {
    return this.users.updateProfile(ctx.req.user.userId, input as any).then(() => true);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  updateMyPassword(@Args('input') input: UpdatePasswordInput, @Context() ctx: any) {
    const req = ctx?.req;
    const ip = (req?.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req?.ip || req?.socket?.remoteAddress || undefined;
    return this.users.updatePassword(ctx.req.user.userId, input.current_password, input.new_password, { ipAddress: ip });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  checkEmailExists(@Args('input') input: CheckEmailExistsInput, @Context() ctx: any) {
    return this.users.findByEmail(input.email).then(user => !!user && user.id !== ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  deleteMyAccount(@Context() ctx: any) {
    return this.users.anonymizeUser(ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ReviewType)
  createReview(@Args('input') input: CreateReviewInput, @Context() ctx: any) {
    return this.reviews.createReview(ctx.req.user.userId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ReviewType)
  updateReview(@Args('input') input: UpdateReviewInput, @Context() ctx: any) {
    return this.reviews.updateReview(ctx.req.user.userId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  deleteReview(@Args('productId') productId: string, @Context() ctx: any) {
    return this.reviews.deleteReview(ctx.req.user.userId, productId);
  }

  @Query(() => [ReviewType])
  productReviews(@Args('productId') productId: string) {
    return this.reviews.productReviews(productId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ReviewType])
  myReviews(@Context() ctx: any) {
    return this.reviews.myReviews(ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Mutation(() => GiftCardType)
  createGiftCard(@Args('input') input: CreateGiftCardInput) {
    return this.giftcards.createGiftCard(input as any);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Mutation(() => GiftCardType)
  updateGiftCard(@Args('id') id: string, @Args('input') input: UpdateGiftCardInput) {
    return this.giftcards.updateGiftCard(id, input as any);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Mutation(() => Boolean)
  deleteGiftCard(@Args('id') id: string) {
    return this.giftcards.deleteGiftCard(id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Mutation(() => GiftCardType)
  assignGiftCardToCustomer(@Args('id') id: string, @Args('customerId', { nullable: true }) customerId?: string) {
    return this.giftcards.assignGiftCardToCustomer(id, customerId ?? null);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Query(() => [GiftCardType])
  giftCards(@Args('status', { nullable: true }) status?: string, @Args('customerId', { nullable: true }) customerId?: string) {
    return this.giftcards.listGiftCards({ status: status as any, customer_id: customerId });
  }

  // Discounts
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RETAILER', 'WHOLESALER', 'SUPER_ADMIN')
  @Mutation(() => DiscountTypeGQL)
  createDiscount(@Args('input') input: CreateDiscountInput, @Context() ctx: any) {
    return this.discounts.createDiscount(input, { userId: ctx.req.user.userId, role: ctx.req.user.role });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RETAILER', 'WHOLESALER', 'SUPER_ADMIN')
  @Mutation(() => DiscountTypeGQL)
  updateDiscount(@Args('id') id: string, @Args('input') input: UpdateDiscountInput, @Context() ctx: any) {
    return this.discounts.updateDiscount(id, input, { userId: ctx.req.user.userId, role: ctx.req.user.role });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => Boolean)
  deleteDiscount(@Args('id') id: string, @Context() ctx: any) {
    return this.discounts.deleteDiscount(id, { role: ctx.req.user.role });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RETAILER', 'WHOLESALER', 'SUPER_ADMIN')
  @Query(() => [DiscountTypeGQL])
  discountsList(
    @Args('vendorId', { nullable: true }) vendorId: string,
    @Args('type', { nullable: true }) type?: string,
    @Context() ctx?: any,
  ) {
    return this.discounts.listDiscounts({ vendor_id: vendorId, type }, { userId: ctx.req.user.userId, role: ctx.req.user.role });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RETAILER', 'WHOLESALER', 'SUPER_ADMIN')
  @Mutation(() => CollectionType)
  createCollection(@Args('input') input: CreateCollectionInput, @Context() ctx: any) {
    return this.collections.createCollection(input, { userId: ctx.req.user.userId, role: ctx.req.user.role });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RETAILER', 'WHOLESALER', 'SUPER_ADMIN')
  @Mutation(() => CollectionType)
  updateCollection(@Args('id') id: string, @Args('input') input: UpdateCollectionInput, @Context() ctx: any) {
    return this.collections.updateCollection(id, input, { userId: ctx.req.user.userId, role: ctx.req.user.role });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RETAILER', 'WHOLESALER', 'SUPER_ADMIN')
  @Mutation(() => Boolean)
  deleteCollection(@Args('id') id: string, @Context() ctx: any) {
    return this.collections.deleteCollection(id, { userId: ctx.req.user.userId, role: ctx.req.user.role });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RETAILER', 'WHOLESALER', 'SUPER_ADMIN')
  @Mutation(() => Boolean)
  addProductsToCollection(@Args('input') input: ModifyCollectionProductsInput, @Context() ctx: any) {
    return this.collections.addProducts(input.collection_id, input.product_ids, { userId: ctx.req.user.userId, role: ctx.req.user.role });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RETAILER', 'WHOLESALER', 'SUPER_ADMIN')
  @Mutation(() => Boolean)
  removeProductFromCollection(@Args('collectionId') collectionId: string, @Args('productId') productId: string, @Context() ctx: any) {
    return this.collections.removeProduct(collectionId, productId, { userId: ctx.req.user.userId, role: ctx.req.user.role });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RETAILER', 'WHOLESALER', 'SUPER_ADMIN')
  @Query(() => VendorNotificationSettingsType)
  vendorNotificationSettings(@Args('vendorId') vendorId: string) {
    return this.vendorNotifs.getSettings(vendorId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RETAILER', 'WHOLESALER', 'SUPER_ADMIN')
  @Mutation(() => VendorNotificationSettingsType)
  updateVendorNotificationSettings(@Args('vendorId') vendorId: string, @Args('input') input: UpdateVendorNotificationSettingsInput) {
    return this.vendorNotifs.updateSettings(vendorId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => String)
  async getInvoiceUrl(@Args('orderId') orderId: string, @Context() ctx: any) {
    return this.documents.getInvoiceUrl(orderId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => String)
  async getReceiptUrl(@Args('orderId') orderId: string, @Context() ctx: any) {
    return this.documents.getReceiptUrl(orderId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async generateInvoice(@Args('orderId') orderId: string, @Context() ctx: any) {
    return this.documents.generateInvoice(orderId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async generateReceipt(@Args('orderId') orderId: string, @Context() ctx: any) {
    return this.documents.generateReceipt(orderId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Query(() => DashboardStatsType)
  async dashboardStats() {
    return this.dashboard.getDashboardStats();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Query(() => [RecentOrderType])
  async recentOrders(@Args('limit', { nullable: true }) limit?: number) {
    return this.dashboard.getRecentOrders(limit || 5);
  }
}



