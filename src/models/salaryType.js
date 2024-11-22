import { DataTypes } from "sequelize";

export default (sequelize) => {
  const SalaryType = sequelize.define(
    "SalaryType",
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
      tableName: "salary_types",
      timestamps: false,
    }
  )
  return SalaryType
}
