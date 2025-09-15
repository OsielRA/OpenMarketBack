import { type AuthClaims, getUserId } from '@shared/auth/jwt';
import { HttpError } from '@shared/errors/httpError';
import type { Request } from 'express';

export function requireUser(req: Request): { claims: AuthClaims; userId: number } {
  if (!req.user) throw new HttpError(401, 'No autenticado');
  return { claims: req.user, userId: getUserId(req.user) };
}
