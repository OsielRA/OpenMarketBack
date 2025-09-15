import { AuthService } from '@services/auth.service';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@shared/auth/jwt';
import { validateSchema } from '@shared/validation';
import type { NextFunction, Request, Response } from 'express';

import { loginSchema } from '@/schemas';
import { HttpError } from '@/shared/errors/httpError';

export class AuthController {
  constructor(private readonly svc: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = validateSchema(loginSchema, req.body, 'body');
      const { user, accessToken, refreshToken } = await this.svc.login(dto);

      const useCookies = (process.env.AUTH_USE_COOKIES ?? 'true') === 'true';
      if (useCookies) {
        const maxAge = this.parseMs(process.env.JWT_REFRESH_EXPIRES ?? '7d');
        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/auth/refresh',
          maxAge,
        });
      }

      res.status(200).json({
        user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
        accessToken,
        refreshToken: useCookies ? undefined : refreshToken,
      });
    } catch (err) {
      next(err);
    }
  };

  me = async (req: Request, res: Response) => {
    res.json({ user: req.user });
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        (req.cookies?.refresh_token as string | undefined) ??
        (typeof req.body?.refreshToken === 'string' ? req.body.refreshToken : undefined);
      if (!token) throw new HttpError(401, 'Falta refresh token');

      const claims = verifyRefreshToken(token);
      const accessToken = signAccessToken({ sub: claims.sub, role: claims.role });
      const refreshToken = signRefreshToken({ sub: claims.sub, role: claims.role });

      const useCookies = (process.env.AUTH_USE_COOKIES ?? 'true') === 'true';
      if (useCookies) {
        const maxAge = this.parseMs(process.env.JWT_REFRESH_EXPIRES ?? '7d');
        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/auth/refresh',
          maxAge,
        });
      }

      res.json({ accessToken, refreshToken: useCookies ? undefined : refreshToken });
    } catch (err) {
      next(err);
    }
  };

  logout = async (_req: Request, res: Response) => {
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    res.status(204).send();
  };

  private parseMs(v: string) {
    const m = /^([0-9]+)([smhd])$/.exec(v.trim());
    if (!m) return 7 * 24 * 60 * 60 * 1000;
    const n = Number(m[1]);
    const unit = m[2];
    switch (unit) {
      case 's':
        return n * 1000;
      case 'm':
        return n * 60 * 1000;
      case 'h':
        return n * 60 * 60 * 1000;
      case 'd':
        return n * 24 * 60 * 60 * 1000;
      default:
        return 7 * 24 * 60 * 60 * 1000;
    }
  }
}
