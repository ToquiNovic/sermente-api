import { DataTypes } from "sequelize";

export default (sequelize) => {
  const MaritalStatus = sequelize.define(
    "MaritalStatus",
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
      tableName: "marital_statuses",
      timestamps: false,
    }
  )
  return MaritalStatus;
}
