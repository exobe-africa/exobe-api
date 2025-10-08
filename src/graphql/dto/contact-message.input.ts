import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class ContactMessageInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  message: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  department?: string;
}


