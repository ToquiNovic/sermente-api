import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UserRole = sequelize.define(
    "UserRole",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "roles", 
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "UserRoles",
      timestamps: false,
    }
  );

  return UserRole;
};
