// models/profession.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Profession = sequelize.define(
    "Profession",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      levelOfStudyId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      tableName: "professions",
      timestamps: false,
    }
  );

  return Profession;
};
