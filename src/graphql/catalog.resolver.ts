import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VendorsService } from '../catalog/vendors.service';
import { CategoriesService } from '../catalog/categories.service';
import { ProductsService } from '../catalog/products.service';
import { VariantsService } from '../catalog/variants.service';
import { InventoryService } from '../catalog/inventory.service';
import { OptionsService } from '../catalog/options.service';
import { UsersService } from '../users/users.service';
import { OrdersService } from '../catalog/orders.service';
import { VendorType, CategoryType, ProductType, ProductVariantType, ProductMediaType, CategoryTreeType, ProductOptionType, UserAddressType, OrderType, VatRateType, ReturnRequestType, WishlistType } from './types/catalog.types';
import { CreateVendorInput, CreateCategoryInput, CreateProductInput, UpdateProductInput, CreateVariantInput, UpdateVariantInput, attributesArrayToRecord, InventoryAdjustInput, AddVariantMediaInput, AddProductMediaInput, BulkCreateVariantsInput, CreateProductOptionInput, AddOptionValueInput, CreateUserAddressInput, UpdateUserAddressInput, CreateOrderInput, UpdateOrderInput, RequestReturnInput, WishlistItemInput } from './dto/catalog.inputs';
import { ReturnsService } from '../catalog/returns.service';
import { WishlistsService } from '../catalog/wishlists.service';
import { UseGuards } from '@nestjs/common';
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
  ) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => VendorType)
  createVendor(@Args('input') input: CreateVendorInput, @Context() ctx: any) {
    return this.vendors.createVendor({ ...input, ownerUser_id: ctx.req.user.userId });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
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
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN')
  @Mutation(() => ProductType)
  createProduct(@Args('input') input: CreateProductInput, @Context() ctx: any) {
    return this.products.createProduct(input, ctx.req.user.userId, true);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN')
  @Mutation(() => ProductType)
  updateProduct(
    @Args('id') id: string,
    @Args('input') input: UpdateProductInput,
    @Context() ctx: any,
  ) {
    return this.products.updateProduct(id, input, ctx.req.user.userId, true);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN')
  @Mutation(() => Boolean)
  deleteProduct(@Args('id') id: string, @Context() ctx: any) {
    return this.products.deleteProduct(id, ctx.req.user.userId, true);
  }

  @Query(() => ProductType, { nullable: true })
  productById(@Args('id') id: string) {
    return this.products.getProductById(id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN')
  @Mutation(() => ProductVariantType)
  createVariant(@Args('input') input: CreateVariantInput, @Context() ctx: any) {
    const attributes = attributesArrayToRecord(input.attributes);
    return this.variants.createVariant({ ...input, attributes }, ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN')
  @Mutation(() => [ProductVariantType])
  bulkCreateVariants(@Args('input') input: BulkCreateVariantsInput, @Context() ctx: any) {
    const mapped = input.variants.map(v => ({ ...v, attributes: attributesArrayToRecord(v.attributes) }));
    return this.variants.bulkCreateVariants(input.productId, mapped as any, ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN')
  @Mutation(() => ProductOptionType)
  createProductOption(@Args('input') input: CreateProductOptionInput, @Context() ctx: any) {
    return this.options.createOption(input.productId, input.name, input.position ?? 0, ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN')
  @Mutation(() => ProductOptionType)
  addOptionValue(@Args('input') input: AddOptionValueInput, @Context() ctx: any) {
    return this.options.addOptionValue(input.optionId, input.value, input.position ?? 0, ctx.req.user.userId);
  }

  @Query(() => [ProductOptionType])
  productOptions(@Args('productId') productId: string) {
    return this.options.listOptions(productId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN')
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
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN')
  @Mutation(() => Boolean)
  deleteVariant(@Args('id') id: string, @Context() ctx: any) {
    return this.variants.deleteVariant(id, ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN')
  @Mutation(() => String)
  adjustInventory(@Args('input') input: InventoryAdjustInput, @Context() ctx: any) {
    return this.inventory
      .adjustInventory(input.variantId, input.change, input.reason, input.notes, ctx.req.user.userId)
      .then((r) => JSON.stringify(r));
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN')
  @Mutation(() => ProductMediaType)
  addVariantMedia(@Args('input') input: AddVariantMediaInput, @Context() ctx: any) {
    return this.variants.addVariantMedia(input.variantId, { url: input.url, type: input.type, position: input.position }, ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN')
  @Mutation(() => Boolean)
  removeVariantMedia(@Args('mediaId') mediaId: string, @Context() ctx: any) {
    return this.variants.removeVariantMedia(mediaId, ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN')
  @Mutation(() => ProductMediaType)
  addProductMedia(@Args('input') input: AddProductMediaInput, @Context() ctx: any) {
    return this.products.addProductMedia(input.productId, { url: input.url, type: input.type, position: input.position }, ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('RETAILER', 'WHOLESALER', 'ADMIN')
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
      .then((r) => JSON.stringify(r));
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => Boolean)
  approveVendor(@Args('vendorId') vendor_id: string) {
    return this.vendors.approveVendor(vendor_id).then(() => true);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => Boolean)
  suspendVendor(@Args('vendorId') vendor_id: string) {
    return this.vendors.suspendVendor(vendor_id).then(() => true);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => Boolean)
  approveProduct(@Args('productId') product_id: string) {
    return this.products.approveProduct(product_id).then(() => true);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => Boolean)
  archiveProduct(@Args('productId') product_id: string) {
    return this.products.archiveProduct(product_id).then(() => true);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserAddressType)
  createUserAddress(@Args('input') input: CreateUserAddressInput, @Context() ctx: any) {
    return this.users.createAddress(input, ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserAddressType)
  updateUserAddress(
    @Args('id') id: string,
    @Args('input') input: UpdateUserAddressInput,
    @Context() ctx: any,
  ) {
    return this.users.updateAddress(id, input, ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  deleteUserAddress(@Args('id') id: string, @Context() ctx: any) {
    return this.users.deleteAddress(id, ctx.req.user.userId);
  }

  @Query(() => [UserAddressType])
  getUserAddresses(@Args('userId') userId: string) {
    return this.users.getUserAddresses(userId);
  }

  @Mutation(() => OrderType)
  createOrder(@Args('input') input: CreateOrderInput, @Context() ctx: any) {
    const userId = ctx?.req?.user?.userId as string | undefined;
    return this.orders.createOrder({ ...input, userId });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => OrderType)
  updateOrder(@Args('orderId') orderId: string, @Args('input') input: UpdateOrderInput) {
    return this.orders.updateOrder(orderId, input as any);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
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

  @UseGuards(GqlAuthGuard)
  @Query(() => OrderType)
  orderById(@Args('orderId') orderId: string, @Context() ctx: any) {
    const role = ctx.req.user.role;
    const isAdmin = role === 'ADMIN';
    return this.orders.getOrderById(orderId, ctx.req.user.userId, isAdmin);
  }

  // Returns
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

  // Admin: update return status (records timeline event)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => ReturnRequestType)
  updateReturnStatus(@Args('id') id: string, @Args('status') status: string, @Args('description', { nullable: true }) description?: string) {
    return this.returns.updateReturnStatus(id, status, description);
  }

  // Wishlist
  @UseGuards(GqlAuthGuard)
  @Query(() => WishlistType, { nullable: true })
  myWishlist(@Context() ctx: any) {
    return this.wishlists.getWishlist(ctx.req.user.userId);
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
}


