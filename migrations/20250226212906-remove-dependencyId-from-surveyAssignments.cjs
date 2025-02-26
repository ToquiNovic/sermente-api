"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("survey_assignments", "dependencyId");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("survey_assignments", "dependencyId", {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },
};
