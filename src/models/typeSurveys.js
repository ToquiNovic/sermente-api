// models/typeSurveys.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const TypeSurveys = sequelize.define(
    'TypeSurveys',
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
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'type_surveys',
      timestamps: true,
    }
  );

  return TypeSurveys;
};
