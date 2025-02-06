import sequelize from '../conexion.js';
import initModels from '../../models/index.js';
import { hashPassword } from '../utils/cryptoUtils.js'; // Importar la función de hashing

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
      { name: 'Administrador' },
      { name: 'Especialista' },
      { name: 'Encuestado' },
    ]);
    console.log('Roles seeded.');

    // Crear Tipos de Encuestas
    const typeSurveys = await models.TypeSurveys.bulkCreate([
      {
        name: 'Socioeconómica',
        description: 'Encuesta para obtener información socioeconómica del encuestado.',
        state: true,
        isPublic: true,
      },
      {
        name: 'Batería de Riesgo',
        description: 'Encuesta para evaluar riesgos psicosociales.',
        state: true,
        isPublic: true,
      },
    ]);
    console.log('TypeSurveys seeded.');

    // Crear Dependencias
    const dependencies = await models.Dependency.bulkCreate([
      { name: 'Dependencia A' },
      { name: 'Dependencia B' },
      { name: 'Dependencia C' },
    ]);
    console.log('Dependencies seeded.');

    // Crear Usuario Administrador con contraseña encriptada
    const adminRole = roles.find((role) => role.name === 'Administrador');
    const hashedPassword = hashPassword('admin123'); // Hashear la contraseña usando crypto
    const adminUser = await models.User.create({
      numberDoc: '1006458608',
      password: hashedPassword, // Contraseña encriptada
      roleId: adminRole.id,
    });
    console.log('Admin user seeded.');

    // Crear Encuestas Públicas
    const socioEconomicType = typeSurveys.find(
      (type) => type.name === 'Socioeconómica'
    );
    const riskType = typeSurveys.find((type) => type.name === 'Batería de Riesgo');

    const surveys = await models.Survey.bulkCreate([
      {
        title: 'Encuesta Socioeconómica',
        description: 'Primera encuesta pública obligatoria.',
        deadline: '2024-12-31',
        typeSurveyId: socioEconomicType.id,
        createdBy: adminUser.id,
      },
      {
        title: 'Encuesta Batería de Riesgo',
        description: 'Segunda encuesta pública obligatoria.',
        deadline: '2024-12-31',
        typeSurveyId: riskType.id,
        createdBy: adminUser.id,
      },
    ]);
    console.log('Public surveys seeded.');

    // Asociar Dependencias a Encuesta Socioeconómica
    const socioEconomicSurvey = surveys.find(
      (survey) => survey.title === 'Encuesta Socioeconómica'
    );
    await socioEconomicSurvey.addDependencies(dependencies);
    console.log('Dependencies associated with socio-economic survey.');

    console.log('Seeding completed successfully!');
    process.exit(0); // Terminar el script
  } catch (error) {
    console.error('Error while seeding:', error);
    process.exit(1); // Terminar el script con error
  }
};

// Ejecutar el script
seedDatabase();