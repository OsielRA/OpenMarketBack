import { verifyAccessToken } from '@shared/auth/jwt';
import { HttpError } from '@shared/errors/httpError';
import type { NextFunction, Request, Response } from 'express';

type UnlessRule = string | RegExp | ((req: Request) => boolean);

function shouldSkip(req: Request, rules: UnlessRule[]): boolean {
  return rules.some((rule) => {
    if (typeof rule === 'string') return req.path === rule;
    if (rule instanceof RegExp) return rule.test(req.path);
    return rule(req);
  });
}

/**
 * Middleware global de autenticación.
 * - Verifica Access Token (Authorization: Bearer <token>)
 * - Coloca `req.user` con los claims
 * - Permite excluir paths públicos con `unless`
 */
export function validateUser(options?: { unless?: UnlessRule[] }) {
  const unless = options?.unless ?? [
    '/health',
    /^\/auth(\/|$)/, // todo /auth es público (login, refresh, logout)
    // agregar aquí otros públicos de ser necesarios
  ];

  return (req: Request, _res: Response, next: NextFunction) => {
    if (shouldSkip(req, unless)) return next();

    const header = req.header('authorization');
    const bearer = header?.startsWith('Bearer ') ? header.slice(7) : null;

    const token = bearer;
    if (!token) return next(new HttpError(401, 'No autenticado'));

    try {
      const claims = verifyAccessToken(token);
      req.user = claims;
      next();
    } catch {
      next(new HttpError(401, 'Token inválido o expirado'));
    }
  };
}
