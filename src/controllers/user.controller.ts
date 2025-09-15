import type { NextFunction, Request, Response } from 'express';

import { createUserSchema, userIdParamSchema } from '@/schemas';
import { UserService } from '@/services';
import { validateSchema } from '@/shared/validation';

export class UserController {
  constructor(private readonly svc: UserService) {}

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = validateSchema(userIdParamSchema, req.params, 'params');
      const user = await this.svc.getById(input.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = validateSchema(createUserSchema, req.body, 'body');
      const created = await this.svc.register(input);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  };
}
