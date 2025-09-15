import { verifyAccessToken } from '@shared/auth/jwt';
import { HttpError } from '@shared/errors/httpError';
import type { NextFunction, Request, Response } from 'express';

export function authGuard(req: Request, _res: Response, next: NextFunction) {
  try {
    // 1) Authorization: Bearer <token>
    const header = req.header('authorization');
    const bearer = header?.startsWith('Bearer ') ? header.slice(7) : null;

    // 2) O cookie. Por defecto, solo refresh usa cookie.
    const token = bearer ?? null;
    if (!token) throw new HttpError(401, 'No autenticado');

    const claims = verifyAccessToken(token);
    req.user = claims;
    next();
  } catch (err) {
    next(new HttpError(401, 'Token inválido o expirado'));
  }
}

export function roleGuard(roles: Array<'customer' | 'creator' | 'admin'>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new HttpError(401, 'No autenticado'));
    if (!roles.includes(req.user.role)) return next(new HttpError(403, 'Prohibido'));
    next();
  };
}
