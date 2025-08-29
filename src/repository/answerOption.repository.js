import { models } from "../database/conexion.js";

export const findAll = async (transaction = null) => {
  try {
    const answerOptions = await models.AnswerOption.findAll({
      include: [
        {
          model: models.Option,
          as: "option",
          include: [
            {
              model: models.Question,
              as: "question",
              attributes: ["id", "questionText", "questionType"]
            }
          ]
        }
      ],
      transaction
    });
    return answerOptions;
  } catch (error) {
    throw new Error(`Error al obtener todas las respuestas de opciones: ${error.message}`);
  }
};

export const findById = async (id, transaction = null) => {
  try {
    const answerOption = await models.AnswerOption.findByPk(id, {
      include: [
        {
          model: models.Option,
          as: "option",
          include: [
            {
              model: models.Question,
              as: "question",
              attributes: ["id", "questionText", "questionType"]
            }
          ]
        }
      ],
      transaction
    });
    return answerOption;
  } catch (error) {
    throw new Error(`Error al obtener la respuesta de opción por ID ${id}: ${error.message}`);
  }
};

export const findByUserCompanyId = async (userCompanyId, transaction = null) => {
  try {
    const answerOptions = await models.AnswerOption.findAll({
      where: { userCompanyId },
      include: [
        {
          model: models.Option,
          as: "option",
          include: [
            {
              model: models.Question,
              as: "question",
              attributes: ["id", "questionText", "questionType"]
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]],
      transaction
    });
    return answerOptions;
  } catch (error) {
    throw new Error(`Error al obtener respuestas por userCompanyId ${userCompanyId}: ${error.message}`);
  }
};

export const findByOptionId = async (optionId, transaction = null) => {
  try {
    const answerOptions = await models.AnswerOption.findAll({
      where: { optionId },
      include: [
        {
          model: models.Option,
          as: "option",
          include: [
            {
              model: models.Question,
              as: "question",
              attributes: ["id", "questionText", "questionType"]
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]],
      transaction
    });
    return answerOptions;
  } catch (error) {
    throw new Error(`Error al obtener respuestas por optionId ${optionId}: ${error.message}`);
  }
};

export const findByUserAndOption = async (userCompanyId, optionId, transaction = null) => {
  try {
    const answerOption = await models.AnswerOption.findOne({
      where: { 
        userCompanyId, 
        optionId 
      },
      transaction
    });
    return answerOption;
  } catch (error) {
    throw new Error(`Error al buscar respuesta existente: ${error.message}`);
  }
};

export const create = async (answerOptionData, transaction = null) => {
  try {
    const answerOption = await models.AnswerOption.create(answerOptionData, {
      transaction
    });
    return answerOption;
  } catch (error) {
    throw new Error(`Error al crear la respuesta de opción: ${error.message}`);
  }
};

export const update = async (id, updateData, transaction = null) => {
  try {
    const answerOption = await models.AnswerOption.findByPk(id, { transaction });
    
    if (!answerOption) {
      throw new Error("Respuesta de opción no encontrada");
    }

    await answerOption.update(updateData, { transaction });
    return answerOption;
  } catch (error) {
    throw new Error(`Error al actualizar la respuesta de opción: ${error.message}`);
  }
};

export const deleteById = async (id, transaction = null) => {
  try {
    const answerOption = await models.AnswerOption.findByPk(id, { transaction });
    
    if (!answerOption) {
      throw new Error("Respuesta de opción no encontrada");
    }

    await answerOption.destroy({ transaction });
    return answerOption;
  } catch (error) {
    throw new Error(`Error al eliminar la respuesta de opción: ${error.message}`);
  }
};

export const bulkCreate = async (answerOptionsData, transaction = null) => {
  try {
    const answerOptions = await models.AnswerOption.bulkCreate(answerOptionsData, {
      transaction,
      ignoreDuplicates: true
    });
    return answerOptions;
  } catch (error) {
    throw new Error(`Error al crear respuestas en lote: ${error.message}`);
  }
};

export const deleteByUserCompanyId = async (userCompanyId, transaction = null) => {
  try {
    const deletedCount = await models.AnswerOption.destroy({
      where: { userCompanyId },
      transaction
    });
    return deletedCount;
  } catch (error) {
    throw new Error(`Error al eliminar respuestas del usuario: ${error.message}`);
  }
};