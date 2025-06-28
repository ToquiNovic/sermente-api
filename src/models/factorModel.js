// factorModel.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Factor = sequelize.define(
    "factor",
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
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      surveyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "factor",
    }
  );

  return Factor;
};
