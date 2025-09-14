import type { NextFunction, Request, Response } from 'express';

import { UserService } from '@/services';

export class UserController {
  constructor(private readonly svc: UserService) {}

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.svc.getById(Number(req.params.id));
      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const created = await this.svc.register(req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  };
}
