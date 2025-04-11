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
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: 'answers',
      timestamps: true,
    }
  );

  return Answer;
};
