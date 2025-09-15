import { HttpError } from '@shared/errors/httpError';
import { ZodError } from 'zod';

export function formatZodError(err: ZodError) {
  return err.issues.map((i) => ({
    field: i.path.join('.'),
    message: i.message,
    code: i.code,
  }));
}

export function buildValidationError(err: ZodError, target: 'body' | 'query' | 'params' = 'body') {
  return new HttpError(400, 'Validación fallida', {
    target,
    errors: formatZodError(err),
  });
}
