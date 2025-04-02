import { DataTypes } from "sequelize";

export default (sequelize) => {
  const SurveyAssignment = sequelize.define(
    "SurveyAssignment",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userCompanyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      answerOptionId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      reportId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      tableName: "survey_assignments",
      timestamps: true,
    }
  );

  return SurveyAssignment;
};
