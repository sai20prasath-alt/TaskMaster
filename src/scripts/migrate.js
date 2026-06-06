require('dotenv').config();

const { sequelize } = require('../models');

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database migration (sync) completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Database migration failed.', error);
    process.exit(1);
  }
}

run();
