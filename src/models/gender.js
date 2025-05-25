import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Gender",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "genders",
      timestamps: false,
    }
  );
};
