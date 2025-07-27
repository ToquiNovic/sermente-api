import { models, sequelize } from "../database/conexion.js";

export const getAllOptions = async (req, res) => {
  try {
    const options = await models.Option.findAll();
    return res
      .status(200)
      .json({ message: "Opciones obtenidas exitosamente.", options });
  } catch (error) {
    console.error("Error al obtener las opciones:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al obtener las opciones." });
  }
};

export const getOptionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ message: "ID de la opción es obligatorio." });

    const option = await models.Option.findByPk(id);

    if (!option) {
      return res.status(404).json({ message: "Opción no encontrada." });
    }

    return res
      .status(200)
      .json({ message: "Opción obtenida exitosamente.", option });
  } catch (error) {
    console.error("Error al obtener la opción por ID:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al obtener la opción." });
  }
};

export const getOptionbyQuestionId = async (req, res) => {
  try {
    const { questionId } = req.params;
    if (!questionId)
      return res
        .status(400)
        .json({ message: "ID de la pregunta es obligatorio." });
    
    const question = await models.Question.findByPk(questionId);
    if (!question) return res.status(404).json({ message: "Pregunta no encontrada." });

    const options = await models.Option.findAll({ where: { questionId } });
    if (!options)
      return res.status(404).json({ message: "No se encontraron opciones." });

    return res
      .status(200)
      .json({ message: "Opciones obtenidas exitosamente.", options });
  } catch (error) {
    console.error("Error al obtener las opciones por ID de pregunta:", error);
    return res.status(500).json({
      error:
        "Error interno del servidor al obtener las opciones por ID de pregunta.",
    });
  }
};

export const createOption = async (req, res) => {
  try {
    const { questionId, weight, text } = req.body;
    if (!questionId || !text || !weight)
      return res
        .status(400)
        .json({ message: "ID de pregunta, peso y texto son obligatorios." });

    const option = await sequelize.transaction(async (transaction) => {
      const question = await models.Question.findByPk(questionId, {
        transaction,
      });
      if (!question)
        return res.status(404).json({ message: "Pregunta no encontrada." });

      const option = await models.Option.create(
        { questionId, weight, text },
        { transaction }
      );

      return models.Option.findByPk(option.id, {
        include: [{ model: models.Question, as: "question" }],
        transaction,
      });
    });

    res.status(201).json({ message: "Opción creada exitosamente.", option });
  } catch (error) {
    console.error("Error al crear la opción:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al crear la opción." });
  }
};

export const updateOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionId, weight, text } = req.body;
    if (!id) return res.status(400).json({ message: "ID es obligatorio." });

    const option = await sequelize.transaction(async (transaction) => {
      const option = await models.Option.findByPk(id, { transaction });
      if (!option)
        return res.status(404).json({ message: "Opción no encontrada." });

      if (weight) option.weight = weight;
      if (text) option.text = text;
      if (questionId) option.questionId = questionId;

      return await option.save({ transaction });
    });

    return res
      .status(200)
      .json({ message: "Opción actualizada exitosamente.", option });
  } catch (error) {
    console.error("Error al actualizar la opción:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al actualizar la opción." });
  }
};

export const deleteOption = async (req, res) => {
  try {
    const { id } = req.params;

    await sequelize.transaction(async (transaction) => {
      const option = await Option.findById(id, { transaction });
      if (!option)
        return res.status(404).json({ message: "Opción no encontrada." });
      await option.remove({ transaction });
    });
    return res.status(200).json({ message: "Opción eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar la opción:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al eliminar la opción." });
  }
};
