import sequelize from "../conexion.js";
import initModels from "../../models/index.js";
import { hashPassword } from "../../utils/cryptoUtils.js";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const seedDatabase = async () => {
  const transaction = await sequelize.transaction();
  try {
    const models = initModels(sequelize);

    console.log("Truncating tables...");
    await Promise.all([
      models.SurveyAssignment.destroy({
        where: {},
        truncate: { cascade: true },
        transaction,
      }),
      models.Survey.destroy({
        where: {},
        truncate: { cascade: true },
        transaction,
      }),
      models.UserCompany.destroy({
        where: {},
        truncate: { cascade: true },
        transaction,
      }),
      models.Company.destroy({
        where: {},
        truncate: { cascade: true },
        transaction,
      }),
      models.UserRole.destroy({
        where: {},
        truncate: { cascade: true },
        transaction,
      }),
      models.User.destroy({
        where: {},
        truncate: { cascade: true },
        transaction,
      }),
      models.People.destroy({
        where: {},
        truncate: { cascade: true },
        transaction,
      }),
      models.Role.destroy({
        where: {},
        truncate: { cascade: true },
        transaction,
      }),
    ]);
    console.log("Database truncated successfully.");

    // Crear Roles desde .env
    let rolesData;
    try {
      rolesData = JSON.parse(process.env.SYSTEM_ROLES).map((role) => ({
        id: crypto.randomUUID(),
        ...role,
      }));
    } catch (err) {
      console.error("❌ Error al parsear SYSTEM_ROLES desde .env");
      throw err;
    }

    const roles = await models.Role.bulkCreate(rolesData, { transaction });
    console.log("Roles seeded.");

    // Crear Empresa
    const company = await models.Company.create(
      {
        id: crypto.randomUUID(),
        name: "SerMente",
        nitCompany: "10122012334-5",
        legalAgent: "Daniel Toquica",
        address: "Florencia",
        phone: "3024789450",
        email: "j.toquica@udla.edu.co",
        urlIcon: "https://sermente.nyc3.cdn.digitaloceanspaces.com/icon.png",
        numberOfEmployees: 10,
      },
      { transaction }
    );

    // Crear Administradores desde .env
    const adminUsers = [
      {
        password: process.env.ADMIN_PASSWORD_1,
        person: {
          names: process.env.ADMIN_NAME_1,
          surNames: process.env.ADMIN_SURNAME_1,
          email: process.env.ADMIN_EMAIL_1,
          phone: process.env.ADMIN_PHONE_1,
          dependency: process.env.ADMIN_DEPENDENCY_1,
          positionCompany: process.env.ADMIN_POSITIONCOMPANY_1,
        },
        numberDoc: process.env.ADMIN_NUMBERDOC_1,
      },
      {
        password: process.env.ADMIN_PASSWORD_2,
        person: {
          names: process.env.ADMIN_NAME_2,
          surNames: process.env.ADMIN_SURNAME_2,
          email: process.env.ADMIN_EMAIL_2,
          phone: process.env.ADMIN_PHONE_2,
          dependency: process.env.ADMIN_DEPENDENCY_2,
          positionCompany: process.env.ADMIN_POSITIONCOMPANY_2,
        },
        numberDoc: process.env.ADMIN_NUMBERDOC_2,
      },
    ];

    const adminRole = roles.find((role) => role.name === process.env.ROLE_VALIDATION);

    if (!adminRole) {
      throw new Error(
        '❌ No se encontró el rol "Administrador" en los datos cargados desde SYSTEM_ROLES. Revisa el archivo .env'
      );
    }

    const adminRoleId = adminRole.id;

    for (const admin of adminUsers) {
      const person = await models.People.create(
        {
          id: crypto.randomUUID(),
          ...admin.person,
        },
        { transaction }
      );

      const hashedPassword = await hashPassword(admin.password);
      const user = await models.User.create(
        {
          id: crypto.randomUUID(),
          numberDoc: admin.numberDoc,
          password: hashedPassword,
          state: "active",
          peopleId: person.id,
        },
        { transaction }
      );

      await models.UserRole.create(
        {
          id: crypto.randomUUID(),
          userId: user.id,
          roleId: adminRoleId,
        },
        { transaction }
      );

      await models.UserCompany.create(
        {
          id: crypto.randomUUID(),
          companyId: company.id,
          userId: user.id,
          specialistId: user.id,
        },
        { transaction }
      );
    }

    console.log("Admin users and company assignments seeded.");

    // Confirmar la transacción
    await transaction.commit();
    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    console.error("Error while seeding:", error.stack);
    process.exit(1);
  }
};

// Ejecutar el script
seedDatabase();
