import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Gender = sequelize.define(
    "Gender",
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
      tableName: "genders",
      timestamps: false,
    }
  )
  return Gender;
}
