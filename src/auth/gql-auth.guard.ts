import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    return req;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { reply } = ctx.getContext() as { reply?: any };
    if (err || !user) {
      if (reply?.clearCookie) {
        try {
          reply.clearCookie('access_token', { path: '/' });
          reply.clearCookie('refresh_token', { path: '/' });
        } catch (_) {
          // swallow cookie clearing errors
        }
      }
      throw err || new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}


