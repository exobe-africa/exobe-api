import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
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

  signAccessToken(user: { id: string; email: string; role: string }) {
    return this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
  }

  signRefreshToken(user: { id: string }) {
    const expiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN');
    return this.jwt.sign({ sub: user.id, type: 'refresh' }, { expiresIn });
  }

  async setAuthCookies(reply: any, user: { id: string; email: string; role: string }) {
    const access = this.signAccessToken(user);
    const refresh = this.signRefreshToken(user);
    const isProd = this.config.get('NODE_ENV') === 'production';

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
    });
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
      await this.setAuthCookies(reply, { id: user.id, email: user.email, role: user.role });
      return true;
    } catch (e) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
