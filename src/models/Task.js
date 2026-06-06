module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('open', 'in_progress', 'completed'),
        defaultValue: 'open'
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: 'tasks',
      underscored: true
    }
  );

  return Task;
};
