const { Router } = require('express');
const { body } = require('express-validator');

const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const teamController = require('../controllers/teamController');

const router = Router();

router.get('/', auth, teamController.listTeams);

router.post(
  '/',
  auth,
  [body('name').trim().notEmpty(), body('description').optional().isString()],
  validate,
  teamController.createTeam
);

router.get('/:id', auth, teamController.getTeam);

router.put(
  '/:id',
  auth,
  [body('name').optional().isString(), body('description').optional().isString()],
  validate,
  teamController.updateTeam
);

router.delete('/:id', auth, teamController.deleteTeam);
router.post('/:id/invite', auth, [body('email').isEmail().normalizeEmail()], validate, teamController.inviteMember);
router.delete('/:id/members/:userId', auth, teamController.removeMember);

module.exports = router;
