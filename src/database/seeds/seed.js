import sequelize from '../conexion.js';
import initModels from '../../models/index.js';
import { hashPassword } from '../../utils/cryptoUtils.js';
import crypto from 'crypto';

const seedDatabase = async () => {
  const transaction = await sequelize.transaction();
  try {
    const models = initModels(sequelize);

    console.log('Truncating tables...');
    await Promise.all([
      models.SurveyAssignment.destroy({ where: {}, truncate: { cascade: true }, transaction }),
      models.Survey.destroy({ where: {}, truncate: { cascade: true }, transaction }),
      models.UserCompany.destroy({ where: {}, truncate: { cascade: true }, transaction }),
      models.Company.destroy({ where: {}, truncate: { cascade: true }, transaction }),
      models.UserRole.destroy({ where: {}, truncate: { cascade: true }, transaction }),
      models.User.destroy({ where: {}, truncate: { cascade: true }, transaction }),
      models.People.destroy({ where: {}, truncate: { cascade: true }, transaction }),
      models.Role.destroy({ where: {}, truncate: { cascade: true }, transaction })
    ]);
    console.log('Database truncated successfully.');

    // Crear Roles
    const rolesData = [
      { id: crypto.randomUUID(), name: 'Administrador', description: 'Acceso total', state: true },
      { id: crypto.randomUUID(), name: 'Especialista', description: 'Acceso a encuestas', state: true },
      { id: crypto.randomUUID(), name: 'Encuestado', description: 'Acceso limitado', state: true },
    ];
    const roles = await models.Role.bulkCreate(rolesData, { transaction });
    console.log('Roles seeded.');

    // Crear Persona para el Administrador
    const adminPerson = await models.People.create({
      id: crypto.randomUUID(),
      names: 'Admin',
      surNames: 'User',
      email: 'admin@example.com',
      phone: '1234567890',
      dependency: 'Administración',
      positionCompany: 'Administrador',
    }, { transaction });

    // Crear Usuario Administrador
    const hashedPassword = await hashPassword('123456');
    const userAdmin = await models.User.create({
      id: crypto.randomUUID(),
      numberDoc: '1006458608',
      password: hashedPassword,
      state: 'active',
      peopleId: adminPerson.id,
    }, { transaction });
    console.log('Admin user seeded.');

    await models.UserRole.create({
      id: crypto.randomUUID(),
      userId: userAdmin.id,
      roleId: roles.find(role => role.name === 'Administrador').id,
    }, { transaction });

    // Crear Empresa
    const company = await models.Company.create({
      id: crypto.randomUUID(),
      name: 'SerMente',
      nitCompany: '10122012334-5',
      legalAgent: 'Daniel Toquica',
      address: 'Florencia',
      phone: '3024789450',
      email: 'j.toquica@udla.edu.co',
      urlIcon: 'https://sermente.nyc3.cdn.digitaloceanspaces.com/icon.png',
      numberOfEmployees: 10,
    }, { transaction });

    // Asignar Usuario a la Empresa
    const userCompany = await models.UserCompany.create({
      id: crypto.randomUUID(),
      companyId: company.id,
      userId: userAdmin.id,
      specialistId: userAdmin.id,
    }, { transaction });

    // Crear Encuestas
    const surveys = await models.Survey.bulkCreate([
      {
        id: crypto.randomUUID(),
        title: 'Encuesta Socioeconómica',
        description: 'Encuesta obligatoria',
        createdBy: userAdmin.id,
      },
      {
        id: crypto.randomUUID(),
        title: 'Encuesta Batería de Riesgo',
        description: 'Evaluación de riesgos',
        createdBy: userAdmin.id,
      },
    ], { transaction });
    console.log('Surveys seeded.');

    // Asignar Encuestas
    await models.SurveyAssignment.bulkCreate([
      {
        id: crypto.randomUUID(),
        userCompanyId: userCompany.id,
        surveyId: surveys[0].id,
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        userCompanyId: userCompany.id,
        surveyId: surveys[1].id,
        completed: false,
      },
    ], { transaction });
    console.log('Survey assignments seeded.');

    // Confirmar la transacción
    await transaction.commit();
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    console.error('Error while seeding:', error.stack);
    process.exit(1);
  }
};

// Ejecutar el script
seedDatabase();
