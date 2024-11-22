import { Sequelize } from 'sequelize';
import { DB_URL } from '../config/index.js';
import initModels from '../models/index.js';

const sequelize = new Sequelize(DB_URL);

// Inicializar modelos y relaciones
const models = initModels(sequelize);

// Verificar conexión
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// Sincronizar modelos con la base de datos
(async () => {
  try {
    await sequelize.sync({ alter: true }); // Usa alter solo en desarrollo
    console.log('Database & tables synced!');
  } catch (error) {
    console.error('Error syncing the database:', error);
  }
})();

export default sequelize;
export { models };
