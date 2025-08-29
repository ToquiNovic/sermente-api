import { models } from "../database/conexion.js";

export const findById = async (id, transaction = null) => {
  try {
    const userCompany = await models.UserCompany.findByPk(id, { transaction });
    return userCompany;
  } catch (error) {
    throw new Error(`Error al obtener UserCompany por ID ${id}: ${error.message}`);
  }
};