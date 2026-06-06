const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const user = await User.findByPk(payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = { id: user.id, email: user.email, name: user.name };
    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
