const { DataTypes } = require('sequelize');
const buildSequelize = require('../config/database');

const sequelize = buildSequelize();

const User = require('./User')(sequelize, DataTypes);
const Task = require('./Task')(sequelize, DataTypes);
const Team = require('./Team')(sequelize, DataTypes);
const TeamMember = require('./TeamMember')(sequelize, DataTypes);
const Comment = require('./Comment')(sequelize, DataTypes);
const Attachment = require('./Attachment')(sequelize, DataTypes);

User.belongsToMany(Team, { through: TeamMember, foreignKey: 'userId', otherKey: 'teamId' });
Team.belongsToMany(User, { through: TeamMember, foreignKey: 'teamId', otherKey: 'userId' });

Team.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
User.hasMany(Team, { as: 'ownedTeams', foreignKey: 'ownerId' });

Task.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });
Task.belongsTo(Team, { as: 'team', foreignKey: 'teamId' });

User.hasMany(Task, { as: 'createdTasks', foreignKey: 'createdBy' });
User.hasMany(Task, { as: 'assignedTasks', foreignKey: 'assignedTo' });
Team.hasMany(Task, { as: 'tasks', foreignKey: 'teamId' });

Comment.belongsTo(Task, { foreignKey: 'taskId' });
Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
Task.hasMany(Comment, { as: 'comments', foreignKey: 'taskId', onDelete: 'CASCADE' });
User.hasMany(Comment, { as: 'comments', foreignKey: 'authorId' });

Attachment.belongsTo(Task, { foreignKey: 'taskId' });
Attachment.belongsTo(User, { as: 'uploader', foreignKey: 'uploadedBy' });
Task.hasMany(Attachment, { as: 'attachments', foreignKey: 'taskId', onDelete: 'CASCADE' });
User.hasMany(Attachment, { as: 'attachments', foreignKey: 'uploadedBy' });

module.exports = {
  sequelize,
  User,
  Task,
  Team,
  TeamMember,
  Comment,
  Attachment
};
