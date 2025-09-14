import { Router } from 'express';

import { UserController } from '@/controllers';
import { UserSequelizeRepository } from '@/repositories/implementations';
import { UserService } from '@/services';

const repo = new UserSequelizeRepository();
const svc = new UserService(repo);
const ctrl = new UserController(svc);

export const userRouter = Router();
userRouter.get('/:id', ctrl.getById);
userRouter.post('/', ctrl.register);
