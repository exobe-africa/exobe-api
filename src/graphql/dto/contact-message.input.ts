import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';

@InputType()
export class ContactMessageInput {
  @Field()
  name: string;
  @Field()
  @IsEmail()
  email: string;
  @Field({ nullable: true })
  @IsOptional()
  phone?: string;
  @Field()
  subject: string;
  @Field()
  message: string;
  @Field({ nullable: true })
  @IsOptional()
  department?: string;
}


