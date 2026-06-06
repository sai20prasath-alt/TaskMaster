const { Router } = require('express');
const { body, query } = require('express-validator');

const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const taskController = require('../controllers/taskController');

const router = Router();

router.get(
  '/',
  auth,
  [
    query('status').optional().isIn(['open', 'in_progress', 'completed']),
    query('order').optional().isIn(['asc', 'desc']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validate,
  taskController.listTasks
);

router.post(
  '/',
  auth,
  [body('title').trim().notEmpty(), body('status').optional().isIn(['open', 'in_progress', 'completed'])],
  validate,
  taskController.createTask
);

router.get('/:id', auth, taskController.getTask);

router.put(
  '/:id',
  auth,
  [body('status').optional().isIn(['open', 'in_progress', 'completed'])],
  validate,
  taskController.updateTask
);

router.delete('/:id', auth, taskController.deleteTask);

router.patch(
  '/:id/status',
  auth,
  [body('status').isIn(['open', 'in_progress', 'completed'])],
  validate,
  taskController.updateTaskStatus
);

router.post('/:id/assign', auth, [body('userId').isUUID()], validate, taskController.assignTask);

module.exports = router;
