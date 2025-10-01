import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class ChangePasswordInput {
  @Field()
  @MinLength(8)
  currentPassword: string;

  @Field()
  @MinLength(8)
  newPassword: string;
}


