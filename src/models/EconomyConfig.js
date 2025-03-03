import { DataTypes } from "sequelize";

export default (sequelize) => {
    const EconomyConfig = sequelize.define("EconomyConfig", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      surveyCostPerEmployee: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      companyCost: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
      },
    });
  
    return EconomyConfig;
  };
  