import { DataTypes } from "sequelize";

export default (sequelize) => {
  const HousingType = sequelize.define(
    "HousingType",
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
      tableName: "housing_types",
      timestamps: false,
    }
  ) 
  return HousingType;
}
