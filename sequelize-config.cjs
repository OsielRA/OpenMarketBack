import 'dotenv/config';

const base = {
  username: process.env.DB_USER || 'openmarket-user',
  password: process.env.DB_PASS || 'openmarket-pass',
  database: process.env.DB_NAME || 'openmarket',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  dialect: process.env.DB_DIALECT || 'postgres',
  logging: false,
};

export default {
  development: base,
  test: { ...base, database: `${base.database}_test`, logging: false },
  production: { ...base, logging: false },
};
