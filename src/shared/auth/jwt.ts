import { Env } from '@config/env';
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';

export type UserRole = 'customer' | 'creator' | 'admin';

export type AuthClaims = JwtPayload & {
  sub: string;
  role: UserRole;
};

const issuer: string = Env.JWT.JWT_ISSUER ?? 'openmarket';
const audience: string = Env.JWT.JWT_AUDIENCE ?? 'openmarket-app';

const accessSecret: string = Env.JWT.JWT_ACCESS_SECRET!;
const refreshSecret: string = Env.JWT.JWT_REFRESH_SECRET!;
if (!accessSecret) throw new Error('JWT_ACCESS_SECRET is required');
if (!refreshSecret) throw new Error('JWT_REFRESH_SECRET is required');

const accessOpts: SignOptions = {
  expiresIn: (Env.JWT.JWT_ACCESS_EXPIRES ?? '15m') as SignOptions['expiresIn'],
  issuer,
  audience,
};
const refreshOpts: SignOptions = {
  expiresIn: (Env.JWT.JWT_REFRESH_EXPIRES ?? '7d') as SignOptions['expiresIn'],
  issuer,
  audience,
};

export function signAccessToken(claims: AuthClaims): string {
  return jwt.sign(claims, accessSecret, accessOpts);
}

export function signRefreshToken(claims: AuthClaims): string {
  return jwt.sign(claims, refreshSecret, refreshOpts);
}

export function verifyAccessToken(token: string): AuthClaims {
  const decoded = jwt.verify(token, accessSecret, { issuer, audience });
  if (typeof decoded === 'string') throw new Error('Invalid token payload');
  return decoded as AuthClaims;
}

export function verifyRefreshToken(token: string): AuthClaims {
  const decoded = jwt.verify(token, refreshSecret, { issuer, audience });
  if (typeof decoded === 'string') throw new Error('Invalid token payload');
  return decoded as AuthClaims;
}

export function getUserId(claims: AuthClaims): number {
  const n = Number(claims.sub);
  if (Number.isNaN(n)) throw new Error('Invalid sub claim');
  return n;
}
