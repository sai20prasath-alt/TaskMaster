const fs = require('fs');
const path = require('path');
const { Comment, Attachment, Task, User } = require('../models');

async function listComments(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comments = await Comment.findAll({
      where: { taskId: task.id },
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(comments);
  } catch (error) {
    return next(error);
  }
}

async function addComment(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = await Comment.create({
      taskId: task.id,
      authorId: req.user.id,
      body: req.body.body
    });

    return res.status(201).json(comment);
  } catch (error) {
    return next(error);
  }
}

async function deleteComment(req, res, next) {
  try {
    const comment = await Comment.findOne({
      where: {
        id: req.params.id,
        taskId: req.params.taskId
      }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }

    await comment.destroy();
    return res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    return next(error);
  }
}

async function uploadAttachment(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const attachment = await Attachment.create({
      taskId: task.id,
      uploadedBy: req.user.id,
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    return res.status(201).json(attachment);
  } catch (error) {
    return next(error);
  }
}

async function deleteAttachment(req, res, next) {
  try {
    const attachment = await Attachment.findOne({
      where: {
        id: req.params.id,
        taskId: req.params.taskId
      }
    });

    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    if (attachment.uploadedBy !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own attachments' });
    }

    const resolvedPath = path.resolve(attachment.path);
    if (fs.existsSync(resolvedPath)) {
      fs.unlinkSync(resolvedPath);
    }

    await attachment.destroy();
    return res.status(200).json({ message: 'Attachment deleted' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listComments,
  addComment,
  deleteComment,
  uploadAttachment,
  deleteAttachment
};
