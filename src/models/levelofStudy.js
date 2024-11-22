import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const LevelOfStudy = sequelize.define(
    "LevelOfStudy",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
