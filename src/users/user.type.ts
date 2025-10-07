import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

registerEnumType(Role, { name: 'Role' });

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  first_name?: string;

  @Field({ nullable: true })
  last_name?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  agree_to_terms: boolean;

  @Field()
  subscribe_newsletter: boolean;

  @Field(() => Role)
  role: Role;

  @Field({ nullable: true })
  token?: string;
}
