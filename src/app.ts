import { authRouter } from '@routes/auth.routes';
import cookieParser from 'cookie-parser';
import express from 'express';
import { json, urlencoded } from 'express';

import { userRouter } from './routes/user.routes';
import { errorHandler } from './shared/middlewares/errorHandler';
import { validateUser } from './shared/middlewares/validateUser';

const app = express();

app.use(json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);

app.use(validateUser());
app.use('/api/users', userRouter);

app.use(errorHandler);

export { app };
