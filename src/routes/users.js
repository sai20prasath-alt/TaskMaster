const { Router } = require('express');
const { body } = require('express-validator');

const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const userController = require('../controllers/userController');

const router = Router();

router.get('/me', auth, userController.getMe);

router.put(
  '/me',
  auth,
  [body('email').optional().isEmail(), body('name').optional().isString(), body('password').optional().isLength({ min: 8 })],
  validate,
  userController.updateMe
);

router.delete('/me', auth, userController.deleteMe);

module.exports = router;
