import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SubCategory = sequelize.define(
    'SubCategory',
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
      tableName: 'subcategories',
      timestamps: true,
    }
  );

  return SubCategory;
};
