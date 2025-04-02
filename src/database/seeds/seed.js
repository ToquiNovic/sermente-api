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

    console.log('Re-enabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;', { raw: true });

    console.log('Database truncated successfully.');

    // Crear Roles
    const roles = await models.Role.bulkCreate([
      { id: crypto.randomUUID(), name: 'Administrador', description: 'El rol de administrador tiene acceso a todas las funciones.', state: true },
      { id: crypto.randomUUID(), name: 'Especialista', description: 'El rol de especialista tiene acceso a las funciones relacionadas con la encuesta.', state: true },
      { id: crypto.randomUUID(), name: 'Encuestado', description: 'El rol de encuestado tiene acceso a las funciones relacionadas con la encuesta.', state: true },
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

    console.log('Admin user seeded.');

    // company
    const company = await models.Company.create({
      id: crypto.randomUUID(),
      name: 'SerMente',
      nitCompany: '10122012334-5',
      legalAgent: 'Daniel Toquica',
      address: 'florencia',
      phone: '3024789450',
      email: 'j.toquica@udla.edu.co',
      urlIcon: 'https://sermente.nyc3.cdn.digitaloceanspaces.com/companies/3a601c4e-5c22-451d-9317-69e4eb8477f7.png',
      numberOfEmployees: 10,
    });

    await models.UserCompany.create({
      id: crypto.randomUUID(),
      companyId: company.id,
      userId: userAdmin.id,
      specialistId: userAdmin.id,
    });

    // Crear Encuestas
    const companys = await models.Survey.bulkCreate([
      {
        id: crypto.randomUUID(),
        title: 'Encuesta Socioeconómica',
        description: 'Primera encuesta pública obligatoria.',
        createdBy: userAdmin.id,
      },
      {
        id: crypto.randomUUID(),
        title: 'Encuesta Batería de Riesgo',
        description: 'Segunda encuesta pública obligatoria.',
        createdBy: userAdmin.id,
      },
    ]);
    console.log('Public surveys seeded.');

    await models.SurveyAssignment.bulkCreate([
      {
        id: crypto.randomUUID(),
        userCompanyId: companys[0].id,
        surveyId: companys[0].id,
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        userCompanyId: companys[1].id,
        surveyId: companys[1].id,
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
