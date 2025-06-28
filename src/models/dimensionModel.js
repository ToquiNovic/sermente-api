// dimensionModel.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Dimension = sequelize.define(
    "dimension",
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
      domainId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "active",
        allowNull: false,
      },
    },
    {
      tableName: "dimension",
      timestamps: true,
    }
  );

  return Dimension;
};
