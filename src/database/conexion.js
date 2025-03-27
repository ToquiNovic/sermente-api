import { Sequelize } from 'sequelize';
import logger from "../utils/logger.js";
import { DB_URL, NODE_ENV } from "../config/index.js";
import initModels from "../models/index.js";

if (!DB_URL) {
  throw new Error("DB_URL no está definida. Verifica las variables de entorno.");
}

const sequelize = new Sequelize(DB_URL, {
  logging: NODE_ENV === 'development' ? console.log : false,
});

// Inicializar modelos
const models = initModels(sequelize);

(async () => {
  try {
    await sequelize.authenticate();
    logger.inf("Connection to the database has been established successfully.");

    if (NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      logger.inf("Database synchronized successfully in development mode.");
    } else {
      logger.inf("Production mode: No sync operation performed. Use migrations.");
    }
  } catch (error) {
    logger.err("Database connection error:", error);
  }
})();

export default sequelize;
export { sequelize, models };
