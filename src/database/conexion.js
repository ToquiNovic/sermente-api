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
sequelize
  .authenticate()
  .then(() => {
    logger.inf("Connection to the database has been established successfully.");
  })
  .catch((error) => {
    logger.err("Unable to connect to the database:", error);
  });

// Sincronización condicional
if (NODE_ENV === "development") {
  (async () => {
    try {
      await sequelize.sync({ force: true });
      logger.inf("Database & tables recreated in development mode.");
    } catch (error) {
      logger.err("Error syncing the database:", error);
    }
  })();
} else {
  logger.inf("Production mode: No sync operation performed. Use migrations.");
}

export default sequelize;
export { sequelize, models };