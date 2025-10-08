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

  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  business_name: string;

  @Field()
  business_summary: string;

  @Field()
  status: string;
}

@ObjectType()
class ServiceProviderApplicationType {
  @Field()
  id: string;

  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  date_of_birth?: string;

  @Field()
  id_number: string;

  @Field()
  identification_type: string;

  @Field(() => [String])
  service_categories: string[];

  @Field()
  primary_service: string;

  @Field()
  experience: string;

  @Field({ nullable: true })
  qualifications?: string;

  @Field({ nullable: true })
  portfolio?: string;

  @Field()
  hourly_rate: string;

  @Field()
  availability: string;

  @Field()
  address: string;

  @Field()
  city: string;

  @Field()
  province: string;

  @Field()
  postal_code: string;

  @Field()
  service_radius: string;

  @Field()
  transport_mode: string;

  @Field({ nullable: true })
  business_name?: string;

  @Field({ nullable: true })
  business_registration?: string;

  @Field({ nullable: true })
  vat_registered?: string;

  @Field({ nullable: true })
  vat_number?: string;

  @Field({ nullable: true })
  bank_details?: string;

  @Field({ nullable: true })
  emergency_contact?: string;

  @Field({ nullable: true })
  work_samples?: string;

  @Field({ nullable: true })
  client_references?: string;

  @Field({ nullable: true })
  certifications?: string;

  @Field({ nullable: true })
  insurance?: string;

  @Field({ nullable: true })
  background_check?: string;

  @Field()
  motivation: string;

  @Field({ nullable: true })
  goals?: string;

  @Field()
  how_did_you_hear: string;

  @Field()
  agree_to_terms: boolean;

  @Field()
  agree_to_background: boolean;

  @Field()
  status: string;
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

  @Mutation(() => ServiceProviderApplicationType)
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


