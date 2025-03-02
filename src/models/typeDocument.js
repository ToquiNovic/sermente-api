// models/typeDocument.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const TypeDocument = sequelize.define(
    "TypeDocument",
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
      tableName: "typeDocuments",
      timestamps: true,
    }
  )
  return TypeDocument;
}
