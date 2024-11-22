import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ContractType = sequelize.define(
    "ContractType",
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
      tableName: "contract_types",
      timestamps: false,
    }
  );

  return ContractType;
};
