const { Team, TeamMember, User } = require('../models');

async function listTeams(req, res, next) {
  try {
    const teams = await Team.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
          through: { attributes: ['role'] },
          where: { id: req.user.id }
        }
      ]
    });

    res.status(200).json(teams);
  } catch (error) {
    next(error);
  }
}

async function createTeam(req, res, next) {
  try {
    const team = await Team.create({
      name: req.body.name,
      description: req.body.description,
      ownerId: req.user.id
    });

    await TeamMember.create({ userId: req.user.id, teamId: team.id, role: 'owner' });

    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
}

async function getTeam(req, res, next) {
  try {
    const team = await Team.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'], through: { attributes: ['role'] } }]
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    return res.status(200).json(team);
  } catch (error) {
    return next(error);
  }
}

async function updateTeam(req, res, next) {
  try {
    const team = await Team.findByPk(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only team owner can update team' });
    }

    await team.update({
      name: req.body.name ?? team.name,
      description: req.body.description ?? team.description
    });

    return res.status(200).json(team);
  } catch (error) {
    return next(error);
  }
}

async function deleteTeam(req, res, next) {
  try {
    const team = await Team.findByPk(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only team owner can delete team' });
    }

    await team.destroy();

    return res.status(200).json({ message: 'Team deleted' });
  } catch (error) {
    return next(error);
  }
}

async function inviteMember(req, res, next) {
  try {
    const team = await Team.findByPk(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only team owner can invite members' });
    }

    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [membership] = await TeamMember.findOrCreate({
      where: { teamId: team.id, userId: user.id },
      defaults: { role: 'member' }
    });

    return res.status(201).json(membership);
  } catch (error) {
    return next(error);
  }
}

async function removeMember(req, res, next) {
  try {
    const team = await Team.findByPk(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only team owner can remove members' });
    }

    const removed = await TeamMember.destroy({
      where: {
        teamId: team.id,
        userId: req.params.userId,
        role: 'member'
      }
    });

    if (!removed) {
      return res.status(404).json({ message: 'Member not found' });
    }

    return res.status(200).json({ message: 'Member removed' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listTeams,
  createTeam,
  getTeam,
  updateTeam,
  deleteTeam,
  inviteMember,
  removeMember
};
