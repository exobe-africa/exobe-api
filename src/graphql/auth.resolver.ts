import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { UserType } from '../users/user.type';
import { LoginInput } from './dto/login.input';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ChangePasswordInput } from './dto/change-password.input';
import { CustomerNotificationsService } from '../users/customer-notifications.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
    private readonly customerNotifs: CustomerNotificationsService,
  ) {}

  @Mutation(() => UserType)
  async login(
    @Args('input') input: LoginInput,
    @Context() ctx: any,
  ) {
    const user = await this.auth.validateUser(input.email, input.password);
    // Temporary: return token inline instead of setting cookie to unblock frontend
    const token = this.auth.signAccessToken({ id: user.id, email: user.email, role: user.role, roles: (user as any).roles || [] });
    // Fire-and-forget login alert email if enabled in settings
    try {
      const ua = ctx?.req?.headers?.['user-agent'] || '';
      const ip = (ctx?.req?.ip || ctx?.req?.socket?.remoteAddress || '') as string;
      // Device/Browser extraction can be enhanced; for now pass UA string for both
      this.customerNotifs
        .sendLoginAlertEmail(user.id, ua || 'unknown device', ua || 'unknown browser', ip || 'unknown')
        .catch(() => void 0);
    } catch (_) {}
    return { ...user, token } as any;
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
    @Context() ctx: any,
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
    // Notify password change if enabled
    try {
      const ip = (ctx?.req?.ip || ctx?.req?.socket?.remoteAddress || '') as string;
      await this.customerNotifs.sendPasswordChangedEmail(user.userId, ip || 'unknown');
    } catch (_) {}
    return true;
  }

  @Mutation(() => Boolean)
  async requestPasswordReset(@Args('email') email: string) {
    await this.auth.requestPasswordReset(email);
    return true;
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
    @Context() ctx: any,
  ) {
    const ip = (ctx?.req?.ip || ctx?.req?.socket?.remoteAddress || '') as string;
    await this.auth.resetPassword(token, newPassword, ip);
    return true;
  }
}


