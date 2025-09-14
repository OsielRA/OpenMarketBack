import { app } from './app';
import { sequelize } from './config/database';
import { Env } from './config/env';
import { initModels } from './database/models';

async function bootstrap() {
  try {
    initModels(sequelize);
    await sequelize.authenticate();
    console.log('DB connection ✅');

    app.listen(Env.PORT, () => {
      console.log(`Server running on http://localhost:${Env.PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}

bootstrap();
