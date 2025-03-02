// models/user.js
import { DataTypes } from "sequelize";
import { hashPassword } from "../utils/cryptoUtils.js";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      numberDoc: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.ENUM("active", "inactive","suspended"),
        defaultValue: "active",
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = hashPassword(user.password);
          }
        },
      },
    }
  );

  return User;
};
