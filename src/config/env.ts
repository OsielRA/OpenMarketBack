import dotenv from 'dotenv';
dotenv.config();

export const Env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3000),

  DB: {
    HOST: process.env.DB_HOST,
    PORT: Number(process.env.DB_PORT),
    NAME: process.env.DB_NAME,
    USER: process.env.DB_USER,
    PASS: process.env.DB_PASS,
    DIALECT: (process.env.DB_DIALECT ?? 'postgres') as 'postgres',
  },

  JWT: {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
    JWT_ISSUER: process.env.JWT_ISSUER,
    JWT_AUDIENCE: process.env.JWT_AUDIENCE,
    AUTH_USE_COOKIES: process.env.AUTH_USE_COOKIES,
  },
};
