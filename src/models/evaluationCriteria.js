import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const EvaluationCriteria = sequelize.define(
    'EvaluationCriteria',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      tableName: 'evaluation_criteria',
      timestamps: true,
    }
  );

  return EvaluationCriteria;
};
