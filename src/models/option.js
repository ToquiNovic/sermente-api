import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Option = sequelize.define(
    'Option',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: 'options',
      timestamps: true,
    }
  );

  return Option;
};
