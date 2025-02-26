import { DataTypes } from "sequelize";

export default (sequelize) => {
  const People = sequelize.define(
    "People",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      names: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      surNames: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      genderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      salaryTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      professionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "professions",
          key: "id",
        },
      },
    },
    {
      tableName: "peoples",
      timestamps: true,
    }
  );

  return People;
};
