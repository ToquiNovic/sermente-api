// controllers/question.controller.js
import { models, sequelize } from "../database/conexion.js";

export const getQuestions = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    if (
      !subCategoryId ||
      typeof subCategoryId !== "string" ||
      subCategoryId.trim() === ""
    ) {
      return res.status(400).json({
        error:
          "La identificación de la subcategoría es requerida y debe ser un texto válido.",
      });
    }

    const questions = await models.Question.findAll({
      where: { subcategoryId: subCategoryId },
      include: [
        {
          model: models.Option,
          as: "options",
          attributes: ["id", "text", "weight"],
        },
      ],
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: "Preguntas no encontradas." });
    }

    return res.status(200).json({
      message: "Preguntas obtenidas con éxito",
      questions,
    });
  } catch (error) {
    console.error("Error al obtener las preguntas:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al obtener las preguntas." });
  }
};

export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { text, position, options } = req.body;

  try {
    const question = await models.Question.findByPk(id);

    if (!question) {
      return res.status(404).json({ message: "Pregunta no encontrada." });
    }

    if (text) {
      question.text = text;
    }

    if (position) {
      question.position = position;
    }

    if (options) {
      await models.Option.destroy({
        where: { questionId: id },
      });

      await models.Option.bulkCreate(
        options.map((option) => ({
          text: option.text,
          weight: option.weight,
          questionId: question.id,
        }))
      );
    }

    await question.save();

    res
      .status(200)
      .json({ message: "Pregunta actualizada con éxito", question });
  } catch (error) {
    console.error("Error al actualizar la pregunta:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al actualizar la pregunta." });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const { subCategoryId, text, position, options } = req.body;
    console.log("Request body:", req.body);

    if (
      !subCategoryId ||
      typeof subCategoryId !== "string" ||
      subCategoryId.trim() === ""
    ) {
      return res.status(400).json({
        error:
          "La identificación de la subcategoría es requerida y debe ser un texto válido.",
      });
    }

    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({
        error:
          "El texto de la pregunta es requerido y debe ser un texto válido.",
      });
    }

    if (!position || typeof position !== "number" || position < 0) {
      return res.status(400).json({
        error:
          "La posición de la pregunta es requerida y debe ser un número positivo.",
      });
    }

    if (!options || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({
        error:
          "Las opciones de la pregunta son requeridas y deben ser un arreglo válido.",
      });
    }

    // Validar que cada opción tenga text y weight
    for (const option of options) {
      if (
        !option.text ||
        typeof option.text !== "string" ||
        option.text.trim() === "" ||
        typeof option.weight !== "number"
      ) {
        return res.status(400).json({
          error: "Cada opción debe tener un texto válido y un peso numérico.",
        });
      }
    }

    const question = await models.Question.create({
      text,
      position,
      subcategoryId: subCategoryId,
    });

    await models.Option.bulkCreate(
      options.map((option) => ({
        text: option.text,
        weight: option.weight,
        questionId: question.id,
      }))
    );

    return res
      .status(201)
      .json({ message: "Pregunta creada con éxito", question });
  } catch (error) {
    console.error("Error al crear la pregunta:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al crear la pregunta." });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ message: "ID de la pregunta es obligatorio." });
  }

  const t = await sequelize.transaction();

  try {
    // 1. Buscar la pregunta
    const question = await models.Question.findByPk(id, { transaction: t });

    if (!question) {
      await t.rollback();
      return res.status(404).json({ message: "Pregunta no encontrada." });
    }

    // 2. Buscar las opciones de esa pregunta
    const options = await models.Option.findAll({
      where: { questionId: id },
      transaction: t,
    });

    // 3. Eliminar las opciones de esa pregunta
    await models.Option.destroy({
      where: { questionId: id },
      transaction: t,
    });

    // 4. Eliminar la pregunta
    await models.Question.destroy({
      where: { id },
      transaction: t,
    });

    await t.commit();

    return res
      .status(200)
      .json({ message: "Pregunta eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar la pregunta:", error);
    await t.rollback();
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
