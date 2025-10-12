import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class SellerApplicationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sellerRole?: string;

  @Field()
  @IsNotEmpty({ message: 'Business type is required' })
  @IsString()
  businessType: string;

  @Field()
  @IsNotEmpty({ message: 'Applicant type is required' })
  @IsString()
  applicantType: string;

  @Field()
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  firstName: string;

  @Field()
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  lastName: string;

  @Field()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  phone: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  landline?: string;

  @Field()
  @IsNotEmpty({ message: 'Identification type is required' })
  @IsString()
  identificationType: string;

  @Field()
  @IsNotEmpty({ message: 'Business name is required' })
  @IsString()
  businessName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  businessRegistration?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  saIdNumber?: string;

  @Field()
  @IsNotEmpty({ message: 'VAT registration status is required' })
  @IsString()
  vatRegistered: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  vatNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  monthlyRevenue?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  physicalStores?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  numberOfStores?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  supplierToRetailers?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  otherMarketplaces?: string;

  @Field()
  @IsNotEmpty({ message: 'Address is required' })
  @IsString()
  address: string;

  @Field()
  @IsNotEmpty({ message: 'City is required' })
  @IsString()
  city: string;

  @Field()
  @IsNotEmpty({ message: 'Province is required' })
  @IsString()
  province: string;

  @Field()
  @IsNotEmpty({ message: 'Postal code is required' })
  @IsString()
  postalCode: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  uniqueProducts?: string;

  @Field()
  @IsNotEmpty({ message: 'Primary category is required' })
  @IsString()
  primaryCategory: string;

  @Field()
  @IsNotEmpty({ message: 'Stock type is required' })
  @IsString()
  stockType: string;

  @Field()
  @IsNotEmpty({ message: 'Product description is required' })
  @IsString()
  @MinLength(5, { message: 'Product description must be at least 10 characters' })
  productDescription: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ownedBrands?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  resellerBrands?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  website?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  socialMedia?: string;

  @Field()
  @IsNotEmpty({ message: 'Business summary is required' })
  @IsString()
  @MinLength(20, { message: 'Business summary must be at least 20 characters' })
  businessSummary: string;

  @Field()
  @IsNotEmpty({ message: 'Please tell us how you heard about us' })
  @IsString()
  howDidYouHear: string;

  @Field()
  @IsBoolean({ message: 'You must agree to the terms and conditions' })
  agreeToTerms: boolean;
}

@InputType()
export class RejectApplicationInput {
  @Field()
  @IsNotEmpty({ message: 'Rejection type is required' })
  @IsString()
  rejectionType: string;

  @Field()
  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  description: string;
}

