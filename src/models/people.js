import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const People = sequelize.define(
    'People',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      firstSurname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastSurname: {
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
      numberDoc: {
        type: DataTypes.STRING,
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
    },
    {
      tableName: 'peoples',
      timestamps: true,
    }
  );

  return People;
};
