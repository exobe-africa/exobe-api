import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;
    const ctx = GqlExecutionContext.create(context);
    const { req, reply } = ctx.getContext() as { req: any; reply?: any };
    const user = req.user as { role?: string } | undefined;
    const allowed = !!user?.role && required.includes(user.role);
    if (!allowed) {
      if (reply?.clearCookie) {
        try {
          reply.clearCookie('access_token', { path: '/' });
          reply.clearCookie('refresh_token', { path: '/' });
        } catch (_) { }
      }
      throw new ForbiddenException('Forbidden');
    }
    return true;
  }
}


