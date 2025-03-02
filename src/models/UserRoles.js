// models/UserRoles.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UserRole = sequelize.define(
    "UserRole",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "UserRoles",
      timestamps: false,
    }
  );

  return UserRole;
};
