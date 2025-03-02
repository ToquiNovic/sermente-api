import { Sequelize } from "sequelize";
import { DB_URL, NODE_ENV } from "../config/index.js";
import initModels from "../models/index.js";
import logger from "../utils/logger.js";

logger.inf(`Running in ${NODE_ENV} mode.`);

// Configurar Sequelize con logging condicional
const sequelize = new Sequelize(DB_URL, {
  logging: NODE_ENV === "development" ? console.log : false,
});

// Inicializar modelos
const models = initModels(sequelize);

// Verificar conexión
(async () => {
  try {
    await sequelize.authenticate();
    logger.inf("Connection to the database has been established successfully.");

    // Sincronización condicional SOLO en desarrollo
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
