import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { UserType } from '../users/user.type';
import { LoginInput } from './dto/login.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ChangePasswordInput } from './dto/change-password.input';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) {}

  @Mutation(() => UserType)
  async login(
    @Args('input') input: LoginInput,
    @Context() ctx: { reply: any },
  ) {
    const user = await this.auth.validateUser(input.email, input.password);
    await this.auth.setAuthCookies(ctx.reply, {
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Context() ctx: { reply: any }) {
    await this.auth.clearAuthCookies(ctx.reply);
    return true;
  }

  @Mutation(() => Boolean)
  async refresh(@Context() ctx: { req: any; reply: any }) {
    await this.auth.refreshTokens(ctx.req, ctx.reply);
    return true;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async changePassword(
    @CurrentUser() user: any,
    @Args('input') input: ChangePasswordInput,
  ) {
    const record = await this.users.findById(user.userId);
    if (!record) {
      return false;
    }
    const isMatch = await (await import('bcrypt')).compare(
      input.currentPassword,
      record.password,
    );
    if (!isMatch) {
      return false;
    }
    await this.users.update(user.userId, { password: input.newPassword });
    return true;
  }
}


