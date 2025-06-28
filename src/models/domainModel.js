// domainModel.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Domain = sequelize.define(
    "domain",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      factorId: {
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
      tableName: "domain",
      timestamps: true,
    }
  );

  return Domain;
};