// src/database/seeds/seed.js
import sequelize from '../conexion.js';
import initModels from '../../models/index.js';
import { hashPassword } from '../../utils/cryptoUtils.js';
import crypto from 'crypto';

const seedDatabase = async () => {
  try {
    const models = initModels(sequelize);

    console.log('Disabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;', { raw: true });

    console.log('Truncating tables...');
    await models.UserRole.destroy({ where: {}, truncate: true });
    await models.User.destroy({ where: {}, truncate: true });
    await models.People.destroy({ where: {}, truncate: true });
    await models.Role.destroy({ where: {}, truncate: true });
    await models.Company.destroy({ where: {}, truncate: true });
    await models.UserCompany.destroy({ where: {}, truncate: true });
    await models.Survey.destroy({ where: {}, truncate: true });
    await models.SurveyAssignment.destroy({ where: {}, truncate: true });

    console.log('Re-enabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;', { raw: true });

    console.log('Database truncated successfully.');

    // Crear Roles
    const roles = await models.Role.bulkCreate([
      { id: crypto.randomUUID(), name: 'Administrador', description: 'Acceso total', state: true },
      { id: crypto.randomUUID(), name: 'Especialista', description: 'Acceso a encuestas', state: true },
      { id: crypto.randomUUID(), name: 'Encuestado', description: 'Acceso limitado', state: true },
    ]);
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
    });
    
    // Crear Usuario Administrador
    const adminRole = roles.find(role => role.name === 'Administrador');
    const hashedPassword = await hashPassword('123456');

    const userAdmin = await models.User.create({
      id: crypto.randomUUID(),
      numberDoc: '1006458608',
      password: hashedPassword,
      state: 'active',
      peopleId: adminPerson.id,
    });
    console.log('Admin user seeded.');

    await models.UserRole.create({
      id: crypto.randomUUID(),
      userId: userAdmin.id,
      roleId: adminRole.id,
    });

    // Crear Empresa
    const company = await models.Company.create({
      id: crypto.randomUUID(),
      name: 'SerMente',
      nitCompany: '10122012334-5',
      legalAgent: 'Daniel Toquica',
      address: 'Florencia',
      phone: '3024789450',
      email: 'j.toquica@udla.edu.co',
      urlIcon: 'https://sermente.nyc3.cdn.digitaloceanspaces.com/companies/icon.png',
      numberOfEmployees: 10,
    });

    // Asignar Usuario a la Empresa
    const userCompany = await models.UserCompany.create({
      id: crypto.randomUUID(),
      companyId: company.id,
      userId: userAdmin.id,
      specialistId: userAdmin.id,
    });

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
    ]);
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
    ]);
    console.log('Survey assignments seeded.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error while seeding:', error);
    process.exit(1);
  }
};

// Ejecutar el script
seedDatabase();
