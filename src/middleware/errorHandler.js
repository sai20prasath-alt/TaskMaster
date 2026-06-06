const logger = require('../utils/logger');

module.exports = function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  logger.error('Request failed', {
    status,
    message,
    stack: err.stack
  });

  res.status(status).json({ message });
};
