const { Router } = require('express');

const authRoutes = require('./auth');
const userRoutes = require('./users');
const taskRoutes = require('./tasks');
const teamRoutes = require('./teams');
const commentRoutes = require('./comments');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/teams', teamRoutes);
router.use('/', commentRoutes);

module.exports = router;
