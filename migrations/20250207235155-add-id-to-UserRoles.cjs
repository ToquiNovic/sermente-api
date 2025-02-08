'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableName = "UserRoles";

    // Verificar si la columna 'id' ya existe antes de intentar agregarla
    const tableDesc = await queryInterface.describeTable(tableName);
    if (!tableDesc.id) {
      await queryInterface.addColumn(tableName, "id", {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      });
    }

    // Verificar y eliminar claves foráneas antes de recrearlas
    const constraints = await queryInterface.getForeignKeysForTables([tableName]);

    if (constraints[tableName].includes("UserRoles_userId_fkey")) {
      await queryInterface.removeConstraint(tableName, "UserRoles_userId_fkey");
    }
    if (constraints[tableName].includes("UserRoles_roleId_fkey")) {
      await queryInterface.removeConstraint(tableName, "UserRoles_roleId_fkey");
    }

    // Volver a agregar las claves foráneas correctamente
    await queryInterface.addConstraint(tableName, {
      fields: ["userId"],
      type: "foreign key",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint(tableName, {
      fields: ["roleId"],
      type: "foreign key",
      references: {
        table: "roles",
        field: "id",
      },
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    const tableName = "UserRoles";

    // Eliminar claves foráneas antes de revertir cambios
    await queryInterface.removeConstraint(tableName, "UserRoles_userId_fkey");
    await queryInterface.removeConstraint(tableName, "UserRoles_roleId_fkey");

    // Verificar si 'id' existe antes de eliminarla
    const tableDesc = await queryInterface.describeTable(tableName);
    if (tableDesc.id) {
      await queryInterface.removeColumn(tableName, "id");
    }

    // Restaurar clave primaria compuesta
    await queryInterface.addConstraint(tableName, {
      fields: ["userId", "roleId"],
      type: "primary key",
    });

    // Volver a agregar las claves foráneas
    await queryInterface.addConstraint(tableName, {
      fields: ["userId"],
      type: "foreign key",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint(tableName, {
      fields: ["roleId"],
      type: "foreign key",
      references: {
        table: "roles",
        field: "id",
      },
      onDelete: "CASCADE",
    });
  },
};
