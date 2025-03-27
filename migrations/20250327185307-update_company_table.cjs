'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('companies', 'nitCompany', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    await queryInterface.changeColumn('companies', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('companies', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    });

    await queryInterface.changeColumn('companies', 'urlIcon', {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    });

    await queryInterface.changeColumn('companies', 'numberOfEmployees', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('companies', 'nitCompany', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false, // Revertimos el cambio
    });

    await queryInterface.changeColumn('companies', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('companies', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('companies', 'urlIcon', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('companies', 'numberOfEmployees', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  }
};
