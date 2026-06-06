module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true }
      }
    },
    {
      tableName: 'comments',
      underscored: true
    }
  );

  return Comment;
};
