import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsOptional } from 'class-validator';

@InputType()
export class SellerApplicationInput {
  @Field()
  businessType: string;
  @Field()
  applicantType: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  @IsEmail()
  email: string;
  @Field()
  phone: string;
  @Field({ nullable: true })
  @IsOptional()
  landline?: string;
  @Field()
  identificationType: string;
  @Field()
  businessName: string;
  @Field({ nullable: true })
  @IsOptional()
  businessRegistration?: string;
  @Field({ nullable: true })
  @IsOptional()
  saIdNumber?: string;
  @Field()
  vatRegistered: string;
  @Field({ nullable: true })
  @IsOptional()
  vatNumber?: string;
  @Field({ nullable: true })
  @IsOptional()
  monthlyRevenue?: string;
  @Field({ nullable: true })
  @IsOptional()
  physicalStores?: string;
  @Field({ nullable: true })
  @IsOptional()
  numberOfStores?: string;
  @Field({ nullable: true })
  @IsOptional()
  supplierToRetailers?: string;
  @Field({ nullable: true })
  @IsOptional()
  otherMarketplaces?: string;
  @Field()
  address: string;
  @Field()
  city: string;
  @Field()
  province: string;
  @Field()
  postalCode: string;
  @Field({ nullable: true })
  @IsOptional()
  uniqueProducts?: string;
  @Field()
  primaryCategory: string;
  @Field()
  stockType: string;
  @Field()
  productDescription: string;
  @Field({ nullable: true })
  @IsOptional()
  ownedBrands?: string;
  @Field({ nullable: true })
  @IsOptional()
  resellerBrands?: string;
  @Field({ nullable: true })
  @IsOptional()
  website?: string;
  @Field({ nullable: true })
  @IsOptional()
  socialMedia?: string;
  @Field()
  businessSummary: string;
  @Field()
  howDidYouHear: string;
  @Field()
  @IsBoolean()
  agreeToTerms: boolean;
}


