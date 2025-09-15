import type { RequestHandler } from 'express';
import type { ZodError, ZodTypeAny } from 'zod';

import { buildValidationError } from './zodErrorFactory';

export function validateSchema<T extends ZodTypeAny>(
  schema: T,
  data: unknown,
  target: 'body' | 'query' | 'params' = 'body',
): import('zod').infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw buildValidationError(result.error as ZodError, target);
  }
  return result.data;
}

export const validateBody = <T extends ZodTypeAny>(schema: T): RequestHandler => {
  return (req, _res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      next(buildValidationError(err as ZodError, 'body'));
    }
  };
};

export const validateQuery = <T extends ZodTypeAny>(schema: T): RequestHandler => {
  return (req, _res, next) => {
    try {
      schema.parse(req.query);
      next();
    } catch (err) {
      next(buildValidationError(err as ZodError, 'query'));
    }
  };
};

export const validateParams = <T extends ZodTypeAny>(schema: T): RequestHandler => {
  return (req, _res, next) => {
    try {
      schema.parse(req.params);
      next();
    } catch (err) {
      next(buildValidationError(err as ZodError, 'params'));
    }
  };
};
