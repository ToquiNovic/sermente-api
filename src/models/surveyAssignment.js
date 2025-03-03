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
      surveyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },  
    },
    {
      tableName: "survey_assignments",
      timestamps: true,
    }
  );

  return SurveyAssignment;
};
