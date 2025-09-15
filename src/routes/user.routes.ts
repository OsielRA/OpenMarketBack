import { Router } from 'express';

import { UserController } from '@/controllers';
import { UserSequelizeRepository } from '@/repositories/implementations';
import { createUserSchema, userIdParamSchema } from '@/schemas';
import { UserService } from '@/services';
import { validateBody, validateParams } from '@/shared/validation';

const repo = new UserSequelizeRepository();
const svc = new UserService(repo);
const ctrl = new UserController(svc);

export const userRouter = Router();
userRouter.get('/:id', validateParams(userIdParamSchema), ctrl.getById);
userRouter.post('/', validateBody(createUserSchema), ctrl.register);
