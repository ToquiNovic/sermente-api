import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Gender = sequelize.define(
    "Gender",
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
      tableName: "genders",
      timestamps: false,
    }
  )
  return Gender;
}
