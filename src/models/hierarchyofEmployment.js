// models/hierarchyofEmployment.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const HierarchyOfEmployment = sequelize.define(
    "HierarchyOfEmployment",
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
      tableName: "hierarchy_of_employment",
      timestamps: false,
    }
  );

  return HierarchyOfEmployment;
};