import { DataTypes } from "sequelize";

export default (sequelize) => {
  const SalaryType = sequelize.define(
    "SalaryType",
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
      tableName: "salary_types",
      timestamps: false,
    }
  )
  return SalaryType
}
