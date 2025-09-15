import { HttpError } from '@shared/errors/httpError';
import type { NextFunction, Request, Response } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
      details: err.details ?? null,
    });
  }
  console.error(err);
  return res.status(500).json({ message: 'Error interno' });
}
