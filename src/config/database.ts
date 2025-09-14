import { Sequelize } from 'sequelize';

import { Env } from './env';

export const sequelize = new Sequelize(Env.DB.NAME, Env.DB.USER, Env.DB.PASS, {
  host: Env.DB.HOST,
  port: Env.DB.PORT,
  dialect: Env.DB.DIALECT,
  logging: false,
});
