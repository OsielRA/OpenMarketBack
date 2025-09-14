import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '../errors/httpError';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err instanceof HttpError ? err.message : 'Internal Server Error';
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message });
}
