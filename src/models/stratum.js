import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Stratum = sequelize.define(
    "Statum",
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
      tableName: 'stratums',
      timestamps: true,
    }

  )
  return Stratum
}

