import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Profession = sequelize.define(
    "Profession",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "professions",
      timestamps: false,
    }
  );

  return Profession;
};
