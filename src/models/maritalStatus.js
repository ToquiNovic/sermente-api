// models/maritalStatus.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const MaritalStatus = sequelize.define(
    "MaritalStatus",
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
      tableName: "marital_statuses",
      timestamps: false,
    }
  )
  return MaritalStatus;
}
