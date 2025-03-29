import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Economy = sequelize.define("Economy", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    credits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return Economy;
};
