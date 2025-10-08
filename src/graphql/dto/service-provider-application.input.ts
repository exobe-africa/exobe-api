import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsOptional, IsString, IsNotEmpty, IsArray, MinLength } from 'class-validator';

@InputType()
export class ServiceProviderApplicationInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(13)
  idNumber: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  identificationType: string;

  @Field(() => [String])
  @IsArray()
  @IsNotEmpty({ each: true })
  serviceCategories: string[];

  @Field()
  @IsString()
  @IsNotEmpty()
  primaryService: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  experience: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  qualifications?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  portfolio?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  hourlyRate: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  availability: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  city: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  province: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  serviceRadius: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  transportMode: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  businessName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  businessRegistration?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  vatRegistered?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  vatNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bankDetails?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  workSamples?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  clientReferences?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  certifications?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  insurance?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  backgroundCheck?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  motivation: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  goals?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  howDidYouHear: string;

  @Field()
  @IsBoolean()
  agreeToTerms: boolean;

  @Field()
  @IsBoolean()
  agreeToBackground: boolean;
}


