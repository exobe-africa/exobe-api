import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsOptional } from 'class-validator';

@InputType()
export class ServiceProviderApplicationInput {
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
  dateOfBirth?: string;
  @Field()
  idNumber: string;
  @Field()
  identificationType: string;
  @Field(() => [String])
  serviceCategories: string[];
  @Field()
  primaryService: string;
  @Field()
  experience: string;
  @Field({ nullable: true })
  @IsOptional()
  qualifications?: string;
  @Field({ nullable: true })
  @IsOptional()
  portfolio?: string;
  @Field()
  hourlyRate: string;
  @Field()
  availability: string;
  @Field()
  address: string;
  @Field()
  city: string;
  @Field()
  province: string;
  @Field()
  postalCode: string;
  @Field()
  serviceRadius: string;
  @Field()
  transportMode: string;
  @Field({ nullable: true })
  @IsOptional()
  businessName?: string;
  @Field({ nullable: true })
  @IsOptional()
  businessRegistration?: string;
  @Field({ nullable: true })
  @IsOptional()
  vatRegistered?: string;
  @Field({ nullable: true })
  @IsOptional()
  vatNumber?: string;
  @Field({ nullable: true })
  @IsOptional()
  bankDetails?: string;
  @Field({ nullable: true })
  @IsOptional()
  emergencyContact?: string;
  @Field({ nullable: true })
  @IsOptional()
  workSamples?: string;
  @Field({ nullable: true })
  @IsOptional()
  clientReferences?: string;
  @Field({ nullable: true })
  @IsOptional()
  certifications?: string;
  @Field({ nullable: true })
  @IsOptional()
  insurance?: string;
  @Field({ nullable: true })
  @IsOptional()
  backgroundCheck?: string;
  @Field()
  motivation: string;
  @Field({ nullable: true })
  @IsOptional()
  goals?: string;
  @Field()
  howDidYouHear: string;
  @Field()
  @IsBoolean()
  agreeToTerms: boolean;
  @Field()
  @IsBoolean()
  agreeToBackground: boolean;
}


