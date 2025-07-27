import {models, sequelize} from "../database/conexion.js";

export const getAllAnswers = async (req, res) => {
  try {
    const answers = await models.AnswerOption.findAll({
      include: [
        {
          model: models.Option,
          as: "option",
        //   include: [{ model: models.Question, as: "question" }],
        },
      ],
    });

    res
      .status(200)
      .json({ message: "Respuestas obtenidas exitosamente.", answers });
  } catch (error) {
    console.error("Error al obtener las respuestas:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al obtener las respuestas." });
  }
};

export const getAnswerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ message: "ID de la respuesta es obligatorio." });

    const answer = await models.AnswerOption.findByPk(id, {
      include: [
        {
          model: models.Option,
          as: "option",
          include: [{ model: models.Question, as: "question" }],
        },
      ],
    });

    if (!answer) {
      return res.status(404).json({ message: "Respuesta no encontrada." });
    }

    res
      .status(200)
      .json({ message: "Respuesta obtenida exitosamente.", answer });
  } catch (error) {
    console.error("Error al obtener la respuesta por ID:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al obtener la respuesta." });
  }
};

export const getAnswerByUserCompanyId = async (req, res) => {
  try {
    const { userCompanyId } = req.params;
    if (!userCompanyId)
      return res
        .status(400)
        .json({ message: "ID de usuario y empresa son obligatorios." });

    const userCompany = await models.UserCompany.findByPk(userCompanyId);
    if (!userCompany)
      return res.status(404).json({ message: "Usuario no encontrado." });

    const answers = await models.AnswerOption.findAll({
      where: {
        userCompanyId,
      },
      include: [
        {
          model: models.Option,
          as: "option",
          include: [{ model: models.Question, as: "question" }],
        },
      ],
    });

    res
      .status(200)
      .json({ message: "Respuestas obtenidas exitosamente.", answers });
  } catch (error) {
    console.error(
      "Error al obtener las respuestas por ID de usuario y empresa:",
      error
    );
    return res.status(500).json({
      error:
        "Error interno del servidor al obtener las respuestas por ID de usuario y empresa.",
    });
  }
};

export const getAnswerByOptionId = async (req, res) => {
  try {
    const { optionId } = req.params;
    if (!optionId)
      return res.status(400).json({ message: "ID de opción es obligatorio." });

    const answers = await models.AnswerOption.findAll({
      where: {
        optionId,
      },
      include: [
        {
          model: models.Option,
          as: "option",
          include: [{ model: models.Question, as: "question" }],
        },
      ],
    });

    res
      .status(200)
      .json({ message: "Respuestas obtenidas exitosamente.", answers });
  } catch (error) {
    console.error("Error al obtener las respuestas por ID de opción:", error);
    return res.status(500).json({
      error:
        "Error interno del servidor al obtener las respuestas por ID de opción.",
    });
  }
};

export const createAnswer = async (req, res) => {
  try {
    const { userCompanyId, optionId } = req.body;
    if (!userCompanyId || !optionId)
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });

    const userCompany = await models.UserCompany.findByPk(userCompanyId);
    if (!userCompany) return res.status(404).json({ message: "Usuario no encontrado." });

    const option = await models.Option.findByPk(optionId);
    if (!option) return res.status(404).json({ message: "Opción no encontrada." });

    const answer = await sequelize.transaction(async (transaction) => {
      const newAnswer = await models.Answer.create(
        {
          userCompanyId,
          optionId,
        },
        { transaction }
      );
      console.log("Respuesta creada:", newAnswer);
      return newAnswer;
    });
    if (!answer)
      return res.status(500).json({ message: "Error al crear la respuesta." });
    res.status(201).json({ message: "Respuesta creada exitosamente.", answer });
  } catch (error) {
    console.error("Error al crear la respuesta:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al crear la respuesta." });
  }
};

export const updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { userCompanyId, optionId } = req.body;

    if (!id || !userCompanyId || !optionId)
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });

    const answer = await sequelize.transaction(async (transaction) => {
      const answer = await models.Answer.findByPk(id, { transaction });
      if (!answer) {
        return res.status(404).json({ message: "Respuesta no encontrada." });
      }

      if (answer.userCompanyId !== userCompanyId) {
        answer.userCompanyId = userCompanyId;
      }
      if (answer.optionId !== optionId) {
        const option = await models.Option.findByPk(optionId, { transaction });
        if (!option) {
          return res.status(404).json({ message: "Opción no encontrada." });
        }
        answer.optionId = optionId;
      }

      await answer.save();
    });

    res
      .status(200)
      .json({ message: "Respuesta actualizada exitosamente.", answer });
  } catch (error) {
    console.error("Error al actualizar la respuesta:", error);
    return res.status(500).json({
      error: "Error interno del servidor al actualizar la respuesta.",
    });
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const answer = await models.Answer.findByPk(id);

    if (!answer) {
      return res.status(404).json({ message: "Respuesta no encontrada." });
    }

    await sequelize.transaction(async (transaction) => {
      await answer.destroy({ transaction });
      res.status(200).json({ message: "Respuesta eliminada con éxito." });
    });
  } catch (error) {
    console.error("Error al eliminar la respuesta:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al eliminar la respuesta." });
  }
};
