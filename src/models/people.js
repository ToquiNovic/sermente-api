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
          is: /^[+]?[\d\s-]+$/,
        },
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dependency: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      positionCompany: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      genderId: {
        type: DataTypes.INTEGER,
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
      hierarchyOfEmploymentId: {
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
