import { AuthController } from '@controllers/auth.controller';
import { AuthService } from '@services/auth.service';
import { authGuard } from '@shared/middlewares/authGuard';
import { validateBody } from '@shared/validation';
import { Router } from 'express';

import { loginSchema } from '@/schemas';

const ctrl = new AuthController(new AuthService());
export const authRouter = Router();

authRouter.post('/login', validateBody(loginSchema), ctrl.login);

authRouter.get('/me', authGuard, ctrl.me);

authRouter.post('/refresh', ctrl.refresh);

authRouter.post('/logout', ctrl.logout);
