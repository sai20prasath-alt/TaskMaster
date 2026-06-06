const { Sequelize } = require('sequelize');

function toBool(value, fallback = false) {
  if (value === undefined) {
    return fallback;
  }

  return String(value).toLowerCase() === 'true';
}

function buildSequelize() {
  const isTest = process.env.NODE_ENV === 'test';
  const dialect = process.env.DB_DIALECT || (isTest ? 'sqlite' : 'postgres');
  const logging = toBool(process.env.DB_LOGGING, false) ? console.log : false;

  if (dialect === 'sqlite') {
    return new Sequelize({
      dialect: 'sqlite',
      storage: isTest ? ':memory:' : process.env.DB_STORAGE || './taskmaster.sqlite',
      logging
    });
  }

  return new Sequelize(
    process.env.DB_NAME || 'taskmaster_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      dialect,
      logging
    }
  );
}

module.exports = buildSequelize;
