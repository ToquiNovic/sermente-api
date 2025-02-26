"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable("peoples");

    if (!tableDescription.professionId) {
      await queryInterface.addColumn("peoples", "professionId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "professions",
          key: "id",
        },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("peoples", "professionId");
  },
};
