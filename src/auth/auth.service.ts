import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  signAccessToken(user: { id: string; email: string; role: string; roles?: string[] }) {
    return this.jwt.sign({ sub: user.id, email: user.email, role: user.role, roles: user.roles || [] });
  }

  signRefreshToken(user: { id: string }) {
    const expiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN');
    return this.jwt.sign({ sub: user.id, type: 'refresh' }, { expiresIn });
  }

  signPasswordResetToken(user: { id: string; email: string }) {
    const secret = this.config.get<string>('JWT_SECRET');
    return this.jwt.sign(
      { sub: user.id, email: user.email, type: 'reset' },
      { secret, expiresIn: '30m' },
    );
  }

  async setAuthCookies(reply: any, user: { id: string; email: string; role: string; roles?: string[] }) {
    const access = this.signAccessToken(user);
    const refresh = this.signRefreshToken(user);
    const isProd = this.config.get('NODE_ENV') === 'production';

    if (reply?.setCookie) {
      reply.setCookie('access_token', access, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
        path: '/',
        maxAge: 60 * 15,
      });
      reply.setCookie('refresh_token', refresh, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return;
    }

    const buildCookie = (
      name: string,
      value: string,
      opts: { httpOnly?: boolean; sameSite?: 'lax' | 'strict' | 'none'; secure?: boolean; path?: string; maxAge?: number },
    ) => {
      const parts = [`${name}=${value}`];
      if (opts.path) parts.push(`Path=${opts.path}`);
      if (opts.maxAge) parts.push(`Max-Age=${opts.maxAge}`);
      if (opts.sameSite) parts.push(`SameSite=${opts.sameSite.charAt(0).toUpperCase() + opts.sameSite.slice(1)}`);
      if (opts.secure) parts.push('Secure');
      if (opts.httpOnly) parts.push('HttpOnly');
      return parts.join('; ');
    };

    if (reply?.header) {
      const cookies = [
        buildCookie('access_token', access, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 15 }),
        buildCookie('refresh_token', refresh, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 60 * 24 * 7 }),
      ];
      reply.header('Set-Cookie', cookies);
      return;
    }

    if (reply?.setHeader) {
      const cookies = [
        buildCookie('access_token', access, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 15 }),
        buildCookie('refresh_token', refresh, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 60 * 24 * 7 }),
      ];
      reply.setHeader('Set-Cookie', cookies);
      return;
    }

    if (reply?.raw?.setHeader) {
      const cookies = [
        buildCookie('access_token', access, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 15 }),
        buildCookie('refresh_token', refresh, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 60 * 24 * 7 }),
      ];
      reply.raw.setHeader('Set-Cookie', cookies);
      return;
    }

    throw new Error('Invalid reply object for setting cookies');
  }

  async clearAuthCookies(reply: any) {
    reply.clearCookie('access_token', { path: '/' });
    reply.clearCookie('refresh_token', { path: '/' });
  }

  async refreshTokens(req: any, reply: any) {
    const token = req?.cookies?.['refresh_token'];
    if (!token) throw new ForbiddenException('No refresh token');
    try {
      const payload = this.jwt.verify(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      }) as any;
      if (payload.type !== 'refresh') throw new ForbiddenException('Invalid token');
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new ForbiddenException('User not found');
      await this.setAuthCookies(reply, { id: user.id, email: user.email, role: user.role, roles: (user as any).roles || [] });
      return true;
    } catch (e) {
      try {
        reply?.clearCookie?.('access_token', { path: '/' });
        reply?.clearCookie?.('refresh_token', { path: '/' });
      } catch (_) { }
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  async requestPasswordReset(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) return;
    const token = this.signPasswordResetToken({ id: user.id, email: user.email });
    const frontendUrl = this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;

    const emailService = new EmailService();
    await emailService.sendTemplatedEmail({
      to: user.email,
      subject: 'Reset your eXobe password',
      template: 'auth/reset-password',
      variables: {
        logoUrl: `${frontendUrl}/apple-touch-icon.png`,
        name: user.name || user.email,
        resetUrl,
        year: new Date().getFullYear().toString(),
      },
    });
  }

  async resetPassword(token: string, newPassword: string, ipAddressForNotify?: string) {
    try {
      const payload = this.jwt.verify(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      }) as any;
      if (payload.type !== 'reset') throw new ForbiddenException('Invalid token');
      await this.users.update(payload.sub, { password: newPassword });
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { CustomerNotificationsService } = require('../users/customer-notifications.service');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { EmailService } = require('../email/email.service');
        const notifs = new CustomerNotificationsService(this.prisma, new EmailService());
        await notifs.sendPasswordChangedEmail(payload.sub, ipAddressForNotify || 'unknown');
      } catch (_) {}
    } catch (e) {
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}
