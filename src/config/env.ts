import dotenv from 'dotenv';
dotenv.config();

export const Env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3000),

  DB: {
    HOST: process.env.DB_HOST ?? 'localhost',
    PORT: Number(process.env.DB_PORT ?? 5432),
    NAME: process.env.DB_NAME ?? 'openmarket',
    USER: process.env.DB_USER ?? 'openmarketuser',
    PASS: process.env.DB_PASS ?? 'openmarketpass',
    DIALECT: (process.env.DB_DIALECT ?? 'postgres') as 'postgres',
  },
};
