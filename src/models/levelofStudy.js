// models/levelofStudy.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const LevelOfStudy = sequelize.define(
    "LevelOfStudy",
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
    },
    {
      tableName: "levels_of_study",
      timestamps: true,
    }
  )
  return LevelOfStudy;
}
