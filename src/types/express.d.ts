import type { AuthClaims } from '../shared/auth/jwt';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthClaims;
  }
}

declare module 'express' {
  interface Request {
    user?: AuthClaims;
  }
}

export {};
