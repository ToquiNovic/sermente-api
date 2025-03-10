// models/company.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Company = sequelize.define(
    "Company",
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
      nitCompany: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      legalAgent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      urlIcon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      numberOfEmployees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      tableName: "companies",
      timestamps: true,
    }
  );

  return Company;
};