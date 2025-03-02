// models/answer.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Answer = sequelize.define(
    'Answer',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      surveyAssignmentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      optionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      tableName: 'answers',
      timestamps: true,
    }
  );

  return Answer;
};
