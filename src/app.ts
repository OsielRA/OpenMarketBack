import express from 'express';
import { json, urlencoded } from 'express';

import { userRouter } from './routes/user.routes';
import { errorHandler } from './shared/middlewares/errorHandler';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/users', userRouter);

app.use(errorHandler);

export { app };
