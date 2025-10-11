import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role, UserRole } from '@prisma/client';

registerEnumType(Role, { name: 'Role' });
registerEnumType(UserRole, { name: 'UserRole' });

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

  @Field(() => [UserRole])
  roles: UserRole[];

  @Field()
  is_active: boolean;

  @Field({ nullable: true })
  token?: string;

  @Field()
  created_at: Date;
}
