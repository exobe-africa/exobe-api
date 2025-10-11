import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserType } from '../users/user.type';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthService } from '../auth/auth.service';
import { RegisterInput } from './dto/register.input.js';
import { CustomerRegisterInput } from './dto/customer-register.input.js';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(
    private users: UsersService,
    private auth: AuthService,
  ) {}

  @Query(() => UserType, { nullable: true })
  userByEmail(@Args('email') email: string) {
    return this.users.findByEmail(email);
  }

  @Mutation(() => UserType)
  async register(@Args('input') input: RegisterInput) {
    if (input.password !== input.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const user = await this.users.register({
      email: input.email,
      password: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      agreeToTerms: input.agreeToTerms,
      subscribeNewsletter: input.subscribeNewsletter,
    });
    
    const token = this.auth.signAccessToken({ id: user.id, email: user.email, role: user.role, roles: (user as any).roles || [] });
    return { ...user, token } as any;
  }

  @Mutation(() => UserType)
  async registerCustomer(@Args('input') input: CustomerRegisterInput) {
    if (input.password !== input.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const user = await this.users.registerCustomer({
      email: input.email,
      password: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      agreeToTerms: input.agreeToTerms,
      subscribeNewsletter: input.subscribeNewsletter,
    });
    
    const token = this.auth.signAccessToken({ id: user.id, email: user.email, role: user.role, roles: (user as any).roles || [] });
    return { ...user, token } as any;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserType)
  me(@CurrentUser() user: any) {
    return this.users.findById(user.userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN','SUPER_ADMIN')
  @Query(() => [UserType])
  async searchUsers(
    @Args('query', { type: () => String, nullable: true }) query?: string,
    @Args('role', { type: () => Role, nullable: true }) role?: Role,
    @Args('isActive', { type: () => Boolean, nullable: true }) isActive?: boolean,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ) {
    return this.users.searchUsers({ query, role, isActive, take, skip });
  }
}
