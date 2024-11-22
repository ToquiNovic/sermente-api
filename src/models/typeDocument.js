import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const TypeDocument = sequelize.define(
    "TypeDocument",
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
      tableName: "typeDocuments",
      timestamps: true,
    }
  )
  return TypeDocument;
}
