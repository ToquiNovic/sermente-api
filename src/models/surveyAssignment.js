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
      userId: {
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
      dependencyId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      peopleId: {
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
