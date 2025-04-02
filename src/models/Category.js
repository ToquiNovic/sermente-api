// models/Category.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Category = sequelize.define(
    'Category',
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      surveyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: 'categories',
      timestamps: true,
    }
  );

  return Category;
};
