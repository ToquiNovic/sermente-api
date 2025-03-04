// models/survey.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Survey = sequelize.define(
    'Survey',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'surveys',
      timestamps: true,
    }
  );

  return Survey;
};
