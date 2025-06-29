// controllers/question.controller.js
import { models, sequelize } from "../database/conexion.js";

export const getQuestions = async (req, res) => {
  try {
    const { dimensionId } = req.params;

    console.log(dimensionId);

    if (
      !dimensionId ||
      typeof dimensionId !== "string" ||
      dimensionId.trim() === ""
    ) {
      return res.status(400).json({
        error:
          "La identificación de la subcategoría es requerida y debe ser un texto válido.",
      });
    }

    const questions = await models.Question.findAll({
      where: { dimensionId: dimensionId },
      include: [
        {
          model: models.Option,
          as: "options",
          attributes: ["id", "text", "weight"],
        },
      ],
    });

    // ✅ Si no hay preguntas, se retorna un array vacío con status 200
    return res.status(200).json({
      message: "Preguntas obtenidas con éxito",
      questions: questions || [],
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
    const { subCategoryId, text, position, isMultipleChoice, options } =
      req.body;

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

    if (typeof position !== "number" || position <= 0) {
      return res.status(400).json({
        error:
          "La posición de la pregunta es requerida y debe ser un número mayor a 0.",
      });
    }

    const existingQuestion = await models.Question.findOne({
      where: {
        subcategoryId: subCategoryId,
        position: position,
      },
    });

    if (existingQuestion) {
      return res.status(400).json({
        error: `La posición ${position} ya está ocupada por otra pregunta. Por favor, elige otra posición.`,
      });
    }

    let finalOptions = [];

    if (isMultipleChoice) {
      if (!options || !Array.isArray(options) || options.length === 0) {
        return res.status(400).json({
          error:
            "Las opciones de la pregunta son requeridas y deben ser un arreglo válido.",
        });
      }

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

      finalOptions = options;
    } else {
      finalOptions = [{ text: "pregunta abierta", weight: 0 }];
    }

    const question = await models.Question.create({
      text,
      position,
      subcategoryId: subCategoryId,
    });

    await models.Option.bulkCreate(
      finalOptions.map((option) => ({
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
    return res.status(500).json({
      error: "Error interno del servidor al crear la pregunta.",
    });
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

export const getQuestionBySurveyId = async (req, res) => {
  try {
    const { surveyId } = req.params;

    if (!surveyId || typeof surveyId !== "string" || surveyId.trim() === "") {
      return res.status(400).json({
        error:
          "La identificación de la encuesta es requerida y debe ser un texto válido.",
      });
    }

    const questions = await models.Factor.findAll({
      where: { surveyId },
      attributes: ["id", "name", "position"],
      order: [["position", "ASC"]],
      include: [
        {
          model: models.Domain,
          as: "domains",
          attributes: ["id", "name"],
          include: [
            {
              model: models.Dimension,
              as: "dimensions",
              attributes: ["id", "name"],
              include: [
                {
                  model: models.Question,
                  as: "questions",
                  attributes: ["id", "text", "position", "dimensionId"],
                  include: [
                    {
                      model: models.Option,
                      as: "options",
                      attributes: ["id", "text", "weight"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      raw: false,
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

export const updateQuestionPosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { position } = req.body;
    const question = await models.Question.findByPk(id);

    console.log("id", id);
    console.log("position", position);

    console.log("question", question);

    if (!question) {
      return res.status(404).json({ message: "Pregunta no encontrada." });
    }

    if (position < 0) {
      return res.status(400).json({
        error: "La posición de la pregunta debe ser un número positivo.",
      });
    }

    question.position = position;

    await question.save();

    res
      .status(200)
      .json({ message: "Posición actualizada con éxito", question });
  } catch (error) {
    console.error("Error al actualizar la posición de la pregunta:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al actualizar la posición." });
  }
};
