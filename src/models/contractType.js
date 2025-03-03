// models/contractType.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ContractType = sequelize.define(
    "ContractType",
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
      tableName: "contract_types",
      timestamps: false,
    }
  );

  return ContractType;
};
