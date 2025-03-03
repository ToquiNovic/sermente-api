// database/seeds/seed.js
import sequelize from '../conexion.js';
import initModels from '../../models/index.js';
import { hashPassword } from '../../utils/cryptoUtils.js';
import crypto from 'crypto';

const seedDatabase = async () => {
  try {
    const models = initModels(sequelize);

    console.log('Disabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;', { raw: true });

    // Sincronizar la base de datos con eliminación forzada
    await sequelize.sync({ force: true });
    console.log('Database synced.');

    console.log('Re-enabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;', { raw: true });

    // Crear Roles
    const roles = await models.Role.bulkCreate([
      { id: crypto.randomUUID(), name: 'Administrador' },
      { id: crypto.randomUUID(), name: 'Especialista' },
      { id: crypto.randomUUID(), name: 'Encuestado' },
    ]);
    console.log('Roles seeded.');

    // Crear Tipos de Encuestas
    const typeSurveys = await models.TypeSurveys.bulkCreate([
      {
        id: crypto.randomUUID(),
        name: 'Socioeconómica',
        description: 'Encuesta para obtener información socioeconómica del encuestado.',
        state: true,
        isPublic: true,
      },
      {
        id: crypto.randomUUID(),
        name: 'Batería de Riesgo',
        description: 'Encuesta para evaluar riesgos psicosociales.',
        state: true,
        isPublic: true,
      },
    ]);
    console.log('TypeSurveys seeded.');

    // Crear Usuario Administrador con contraseña encriptada
    const adminRole = roles.find((role) => role.name === 'Administrador');
    const hashedPassword = hashPassword('123456');
    const adminUser = await models.User.create({
      id: crypto.randomUUID(),
      numberDoc: '1006458608',
      password: hashedPassword,
      roleId: adminRole.id,
    });
    console.log('Admin user seeded.');

    // Crear Tipos de Salario
    const salaryTypes = await models.SalaryType.bulkCreate([
      { id: crypto.randomUUID(), name: 'Mensual' },
      { id: crypto.randomUUID(), name: 'Quincenal' },
    ]);
    console.log('Salary types seeded.');

    // Crear Niveles de Estudio
    const levelsOfStudy = await models.LevelOfStudy.bulkCreate([
      { id: crypto.randomUUID(), name: 'Primaria' },
      { id: crypto.randomUUID(), name: 'Secundaria' },
      { id: crypto.randomUUID(), name: 'Universitario' },
    ]);
    console.log('Levels of study seeded.');

    // Crear Tipos de Contrato
    const contractTypes = await models.ContractType.bulkCreate([
      { id: crypto.randomUUID(), name: 'Indefinido' },
      { id: crypto.randomUUID(), name: 'Temporal' },
    ]);
    console.log('Contract types seeded.');

    // Crear Estados Civiles
    const maritalStatuses = await models.MaritalStatus.bulkCreate([
      { id: crypto.randomUUID(), name: 'Soltero' },
      { id: crypto.randomUUID(), name: 'Casado' },
      { id: crypto.randomUUID(), name: 'Divorciado' },
    ]);
    console.log('Marital statuses seeded.');

    // Crear Géneros
    const genders = await models.Gender.bulkCreate([
      { id: crypto.randomUUID(), name: 'Masculino' },
      { id: crypto.randomUUID(), name: 'Femenino' },
      { id: crypto.randomUUID(), name: 'Otro' },
    ]);
    console.log('Genders seeded.');

    // Crear Encuestas Públicas
    const socioEconomicType = typeSurveys.find((type) => type.name === 'Socioeconómica');
    const riskType = typeSurveys.find((type) => type.name === 'Batería de Riesgo');

    const surveys = await models.Survey.bulkCreate([
      {
        id: crypto.randomUUID(),
        title: 'Encuesta Socioeconómica',
        description: 'Primera encuesta pública obligatoria.',
        deadline: '2024-12-31',
        typeSurveyId: socioEconomicType.id,
        createdBy: adminUser.id,
      },
      {
        id: crypto.randomUUID(),
        title: 'Encuesta Batería de Riesgo',
        description: 'Segunda encuesta pública obligatoria.',
        deadline: '2024-12-31',
        typeSurveyId: riskType.id,
        createdBy: adminUser.id,
      },
    ]);
    console.log('Public surveys seeded.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error while seeding:', error);
    process.exit(1);
  }
};

// Ejecutar el script
seedDatabase();
