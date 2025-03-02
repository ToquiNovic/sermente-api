import { DataTypes } from "sequelize";

export default (sequelize) => {
  const HousingType = sequelize.define(
    "HousingType",
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
      tableName: "housing_types",
      timestamps: false,
    }
  ) 
  return HousingType;
}
