import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Stratum = sequelize.define(
    "Stratum",
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
      tableName: 'stratums',
      timestamps: true,
    }

  )
  return Stratum
}

