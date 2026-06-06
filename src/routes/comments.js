const { Router } = require('express');
const { body } = require('express-validator');

const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const commentController = require('../controllers/commentController');

const router = Router();

router.get('/tasks/:id/comments', auth, commentController.listComments);

router.post(
  '/tasks/:id/comments',
  auth,
  [body('body').trim().notEmpty()],
  validate,
  commentController.addComment
);

router.delete('/tasks/:taskId/comments/:id', auth, commentController.deleteComment);
router.post('/tasks/:id/attachments', auth, upload.single('file'), commentController.uploadAttachment);
router.delete('/tasks/:taskId/attachments/:id', auth, commentController.deleteAttachment);

module.exports = router;
