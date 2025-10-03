import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ApplicationsService } from '../applications/applications.service';
import { SellerApplicationInput } from './dto/seller-application.input';
import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { ServiceProviderApplicationInput } from './dto/service-provider-application.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ObjectType()
class SellerApplicationType {
  @Field()
  id: string;
}

@Resolver()
export class ApplicationsResolver {
  constructor(private apps: ApplicationsService) {}

  @Mutation(() => SellerApplicationType)
  applyRetailer(@Args('input') input: SellerApplicationInput) {
    return this.apps.applySeller(input, Role.RETAILER);
  }

  @Mutation(() => SellerApplicationType)
  applyWholesaler(@Args('input') input: SellerApplicationInput) {
    return this.apps.applySeller(input, Role.WHOLESALER);
  }

  @Mutation(() => SellerApplicationType)
  applyServiceProvider(@Args('input') input: ServiceProviderApplicationInput) {
    return this.apps.applyServiceProvider(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => String)
  approveSellerApplication(@Args('applicationId') applicationId: string) {
    return this.apps.approveSellerApplication(applicationId).then(v => v.id);
  }
}


