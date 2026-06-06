require('dotenv').config();

const { createServer } = require('http');
const app = require('./src/config/app');
const { sequelize } = require('./src/models');
const { initNotifications } = require('./src/services/notificationService');
const logger = require('./src/utils/logger');

const port = Number(process.env.PORT || 3000);

async function bootstrap() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const server = createServer(app);

    if ((process.env.ENABLE_WEBSOCKETS || '').toLowerCase() === 'true') {
      initNotifications(server);
    }

    server.listen(port, () => {
      logger.info(`TaskMaster API listening on port ${port}`);
    });
  } catch (error) {
    logger.error('Unable to start TaskMaster API', { error: error.message });
    process.exit(1);
  }
}

bootstrap();
