import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsOptional, MinLength } from 'class-validator';

@InputType()
export class CustomerRegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  password: string;

  @Field()
  @MinLength(8)
  confirmPassword: string;

  @Field({ nullable: true })
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field()
  @IsBoolean()
  agreeToTerms: boolean;

  @Field()
  @IsBoolean()
  subscribeNewsletter: boolean;
}


