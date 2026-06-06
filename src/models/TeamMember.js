module.exports = (sequelize, DataTypes) => {
  const TeamMember = sequelize.define(
    'TeamMember',
    {
      role: {
        type: DataTypes.ENUM('owner', 'member'),
        defaultValue: 'member'
      }
    },
    {
      tableName: 'team_members',
      underscored: true
    }
  );

  return TeamMember;
};
