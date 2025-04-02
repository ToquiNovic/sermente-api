import { DataTypes } from "sequelize";

export default (sequelize) => {
  const AnswerOption = sequelize.define(
    "AnswerOption",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      answerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      optionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
   {
      tableName: "answer_options",
      timestamps: true,
    }
  );

  return AnswerOption;
};