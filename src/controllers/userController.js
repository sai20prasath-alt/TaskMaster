const bcrypt = require('bcrypt');
const { User } = require('../models');

async function getMe(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

async function updateMe(req, res, next) {
  try {
    const user = await User.scope('withPassword').findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updates = {};

    if (req.body.name) {
      updates.name = req.body.name;
    }

    if (req.body.email) {
      updates.email = req.body.email;
    }

    if (req.body.password) {
      updates.passwordHash = await bcrypt.hash(req.body.password, 10);
    }

    await user.update(updates);
    const updatedUser = await User.findByPk(user.id);

    return res.status(200).json(updatedUser);
  } catch (error) {
    return next(error);
  }
}

async function deleteMe(req, res, next) {
  try {
    const deleted = await User.destroy({ where: { id: req.user.id } });

    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Account deleted' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getMe,
  updateMe,
  deleteMe
};
