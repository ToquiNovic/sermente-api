"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable("users");
    
    if (!tableDescription.state) {
      await queryInterface.addColumn("users", "state", {
        type: Sequelize.ENUM("active", "inactive", "suspended"),
        allowNull: false,
        defaultValue: "active",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "state");
  },
};
