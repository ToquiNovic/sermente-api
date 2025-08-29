import { sequelize } from "../database/conexion.js";
import * as answerOptionRepository from "../repository/answerOption.repository.js";
import * as userCompanyRepository from "../repository/userCompany.repository.js";
import * as optionRepository from "../repository/option.repository.js";

export const getAllAnswerOptions = async (req, res) => {
  try {
    const answerOptions = await answerOptionRepository.findAll();

    res.status(200).json({
      success: true,
      message: "Respuestas de opciones obtenidas exitosamente.",
      data: answerOptions,
      total: answerOptions.length
    });
  } catch (error) {
    console.error("Error al obtener todas las respuestas de opciones:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      error: error.message
    });
  }
};

export const getAnswerOptionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de la respuesta de opción es obligatorio."
      });
    }

    const answerOption = await answerOptionRepository.findById(id);

    if (!answerOption) {
      return res.status(404).json({
        success: false,
        message: "Respuesta de opción no encontrada."
      });
    }

    res.status(200).json({
      success: true,
      message: "Respuesta de opción obtenida exitosamente.",
      data: answerOption
    });
  } catch (error) {
    console.error("Error al obtener la respuesta de opción por ID:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      error: error.message
    });
  }
};

export const getAnswerOptionsByUserCompanyId = async (req, res) => {
  try {
    const { userCompanyId } = req.params;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario-empresa es obligatorio."
      });
    }

    // Verificar que el userCompany existe
    const userCompany = await userCompanyRepository.findById(userCompanyId);
    if (!userCompany) {
      return res.status(404).json({
        success: false,
        message: "Usuario-empresa no encontrado."
      });
    }

    const answerOptions = await answerOptionRepository.findByUserCompanyId(userCompanyId);

    res.status(200).json({
      success: true,
      message: "Respuestas obtenidas exitosamente.",
      data: answerOptions,
      total: answerOptions.length,
      userCompany: {
        id: userCompany.id,
        userId: userCompany.userId,
        companyId: userCompany.companyId
      }
    });
  } catch (error) {
    console.error("Error al obtener respuestas por userCompanyId:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      error: error.message
    });
  }
};

export const getAnswerOptionsByOptionId = async (req, res) => {
  try {
    const { optionId } = req.params;

    if (!optionId) {
      return res.status(400).json({
        success: false,
        message: "ID de opción es obligatorio."
      });
    }

    // Verificar que la opción existe
    const option = await optionRepository.findById(optionId);
    if (!option) {
      return res.status(404).json({
        success: false,
        message: "Opción no encontrada."
      });
    }

    const answerOptions = await answerOptionRepository.findByOptionId(optionId);

    res.status(200).json({
      success: true,
      message: "Respuestas por opción obtenidas exitosamente.",
      data: answerOptions,
      total: answerOptions.length,
      option: {
        id: option.id,
        optionText: option.optionText,
        questionId: option.questionId
      }
    });
  } catch (error) {
    console.error("Error al obtener respuestas por optionId:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      error: error.message
    });
  }
};

// Si ya se cumplió el deadline no se debería poder responder
export const createAnswerOption = async (req, res) => {
  try {
    const { userCompanyId, optionId } = req.body;

    // Validación de campos requeridos
    if (!userCompanyId || !optionId) {
      return res.status(400).json({
        success: false,
        message: "userCompanyId y optionId son obligatorios."
      });
    }

    const result = await sequelize.transaction(async (transaction) => {
      // Verificar que userCompany existe
      const userCompany = await userCompanyRepository.findById(userCompanyId, transaction);
      if (!userCompany) {
        throw new Error("Usuario-empresa no encontrado.");
      }

      // Verificar que option existe
      const option = await optionRepository.findById(optionId, transaction);
      if (!option) {
        throw new Error("Opción no encontrada.");
      }

      // Verificar si ya existe una respuesta para esta combinación
      const existingAnswer = await answerOptionRepository.findByUserAndOption(
        userCompanyId, 
        optionId, 
        transaction
      );

      if (existingAnswer) {
        throw new Error("Ya existe una respuesta para esta opción y usuario.");
      }

      // Crear la respuesta
      const newAnswerOption = await answerOptionRepository.create({
        userCompanyId,
        optionId
      }, transaction);

      return newAnswerOption;
    });

    res.status(201).json({
      success: true,
      message: "Respuesta de opción creada exitosamente.",
      data: result
    });
  } catch (error) {
    console.error("Error al crear la respuesta de opción:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      error: error.message
    });
  }
};

export const createMultipleAnswerOptions = async (req, res) => {
  try {
    const { userCompanyId, optionIds } = req.body;

    // Validación de campos requeridos
    if (!userCompanyId || !optionIds || !Array.isArray(optionIds) || optionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "userCompanyId y optionIds (array no vacío) son obligatorios."
      });
    }

    const result = await sequelize.transaction(async (transaction) => {
      // Verificar que userCompany existe
      const userCompany = await userCompanyRepository.findById(userCompanyId, transaction);
      if (!userCompany) {
        throw new Error("Usuario-empresa no encontrado.");
      }

      // Preparar datos para creación en lote
      const answerOptionsData = optionIds.map(optionId => ({
        userCompanyId,
        optionId
      }));

      // Crear respuestas en lote
      const createdAnswers = await answerOptionRepository.bulkCreate(
        answerOptionsData, 
        transaction
      );

      return {
        created: createdAnswers.length,
        totalRequested: optionIds.length,
        answers: createdAnswers
      };
    });

    res.status(201).json({
      success: true,
      message: "Respuestas de opciones creadas exitosamente.",
      data: result
    });
  } catch (error) {
    console.error("Error al crear múltiples respuestas de opciones:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      error: error.message
    });
  }
};

export const updateAnswerOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { userCompanyId, optionId } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de la respuesta de opción es obligatorio."
      });
    }

    if (!userCompanyId && !optionId) {
      return res.status(400).json({
        success: false,
        message: "Al menos un campo para actualizar es requerido."
      });
    }

    const result = await sequelize.transaction(async (transaction) => {
      // Verificar que existe la respuesta
      const existingAnswer = await answerOptionRepository.findById(id, transaction);
      if (!existingAnswer) {
        throw new Error("Respuesta de opción no encontrada.");
      }

      // Preparar datos de actualización
      const updateData = {};
      
      if (userCompanyId) {
        // Verificar que userCompany existe
        const userCompany = await userCompanyRepository.findById(userCompanyId, transaction);
        if (!userCompany) {
          throw new Error("Usuario-empresa no encontrado.");
        }
        updateData.userCompanyId = userCompanyId;
      }

      if (optionId) {
        // Verificar que option existe
        const option = await optionRepository.findById(optionId, transaction);
        if (!option) {
          throw new Error("Opción no encontrada.");
        }
        updateData.optionId = optionId;
      }

      // Actualizar la respuesta
      const updatedAnswer = await answerOptionRepository.update(id, updateData, transaction);
      return updatedAnswer;
    });

    res.status(200).json({
      success: true,
      message: "Respuesta de opción actualizada exitosamente.",
      data: result
    });
  } catch (error) {
    console.error("Error al actualizar la respuesta de opción:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      error: error.message
    });
  }
};

export const deleteAnswerOption = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de la respuesta de opción es obligatorio."
      });
    }

    const result = await sequelize.transaction(async (transaction) => {
      const deletedAnswer = await answerOptionRepository.deleteById(id, transaction);
      return deletedAnswer;
    });

    res.status(200).json({
      success: true,
      message: "Respuesta de opción eliminada exitosamente.",
      data: {
        id: result.id,
        deletedAt: new Date()
      }
    });
  } catch (error) {
    console.error("Error al eliminar la respuesta de opción:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      error: error.message
    });
  }
};

export const deleteAnswerOptionsByUser = async (req, res) => {
  try {
    const { userCompanyId } = req.params;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: "userCompanyId es obligatorio."
      });
    }

    const result = await sequelize.transaction(async (transaction) => {
      // Verificar que userCompany existe
      const userCompany = await userCompanyRepository.findById(userCompanyId, transaction);
      if (!userCompany) {
        throw new Error("Usuario-empresa no encontrado.");
      }

      const deletedCount = await answerOptionRepository.deleteByUserCompanyId(
        userCompanyId, 
        transaction
      );
      
      return { deletedCount, userCompanyId };
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} respuestas eliminadas exitosamente.`,
      data: result
    });
  } catch (error) {
    console.error("Error al eliminar respuestas del usuario:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      error: error.message
    });
  }
};