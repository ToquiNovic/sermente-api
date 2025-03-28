// models/UserCompany.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UserCompany = sequelize.define(
    "UserCompany",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      companyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      specialistId: {
        type: DataTypes.UUID,
        allowNull: true, 
      },
    },
    {
      tableName: "user_companies",
      timestamps: true,
    }
  );

  return UserCompany;
};
