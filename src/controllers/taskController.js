const { Task, User, Team } = require('../models');
const taskService = require('../services/taskService');
const { notify } = require('../services/notificationService');

async function listTasks(req, res, next) {
  try {
    const data = await taskService.listTasks(req.query);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      status: req.body.status || 'open',
      createdBy: req.user.id,
      assignedTo: req.body.assignedTo || null,
      teamId: req.body.teamId || null
    });

    const fullTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Team, as: 'team', attributes: ['id', 'name'] }
      ]
    });

    notify('task:created', { id: task.id });
    res.status(201).json(fullTask);
  } catch (error) {
    next(error);
  }
}

async function getTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Team, as: 'team', attributes: ['id', 'name'] }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update({
      title: req.body.title ?? task.title,
      description: req.body.description ?? task.description,
      dueDate: req.body.dueDate ?? task.dueDate,
      status: req.body.status ?? task.status,
      assignedTo: req.body.assignedTo ?? task.assignedTo,
      teamId: req.body.teamId ?? task.teamId
    });

    notify('task:updated', { id: task.id });
    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const deleted = await Task.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }

    notify('task:deleted', { id: req.params.id });
    return res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    return next(error);
  }
}

async function updateTaskStatus(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = req.body.status;
    await task.save();
    notify('task:status', { id: task.id, status: task.status });

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
}

async function assignTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const user = await User.findByPk(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: 'Assignee not found' });
    }

    task.assignedTo = user.id;
    await task.save();
    notify('task:assigned', { id: task.id, userId: user.id });

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  assignTask
};
