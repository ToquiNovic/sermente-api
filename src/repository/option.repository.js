import { models } from "../database/conexion.js";

export const findById = async (id, transaction = null) => {
  try {
    const option = await models.Option.findByPk(id, { transaction });
    return option;
  } catch (error) {
    throw new Error(`Error al obtener Option por ID ${id}: ${error.message}`);
  }
};