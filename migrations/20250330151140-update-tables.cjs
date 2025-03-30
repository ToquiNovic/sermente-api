'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("surveys", "deadline");

    await queryInterface.addColumn("survey_assignments", "deadline", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("surveys", "deadline", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.removeColumn("survey_assignments", "deadline");
  },
};