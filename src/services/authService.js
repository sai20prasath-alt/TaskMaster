const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET || 'dev_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

async function register({ name, email, password }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const error = new Error('Email already in use');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const token = signToken(user.id);

  return { token, user };
}

async function login({ email, password }) {
  const user = await User.scope('withPassword').findOne({ where: { email } });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken(user.id);
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

function logout() {
  return { message: 'Logged out successfully' };
}

module.exports = {
  register,
  login,
  logout
};
