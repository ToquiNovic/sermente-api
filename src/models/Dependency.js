import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Dependency = sequelize.define(
    'Dependency',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'dependencies',
      timestamps: false,
    }
  );

  return Dependency;
};
