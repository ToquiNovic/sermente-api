// models/people.js
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
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[0-9+\-() ]{7,15}$/i,
        },
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      genderId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      salaryTypeId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      levelOfStudyId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      dependencyId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      maritalStatusId: {
        type: DataTypes.UUID,
        allowNull: true,
      },      
      typeDocumentId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      stratumId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      housingTypeId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      contractTypeId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      tableName: "peoples",
      timestamps: true,
    }
  );

  return People;
};
