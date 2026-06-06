module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define(
    'Team',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'teams',
      underscored: true
    }
  );

  return Team;
};
