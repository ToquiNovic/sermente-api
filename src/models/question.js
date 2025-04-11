import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Question = sequelize.define(
    'Question',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subcategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: 'questions',
      timestamps: true,
    }
  );

  return Question;
};
