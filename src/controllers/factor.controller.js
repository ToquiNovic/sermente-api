// controllers/factor.controller.js
import { where } from "sequelize";
import { models, sequelize } from "../database/conexion.js";

export const postFactor = async (req, res) => {
  const { name, description, surveyId } = req.body;

  // Validar name
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "El nombre del factor es requerido y debe ser un texto válido.",
    });
  }

  // Validar surveyId
  if (!surveyId || typeof surveyId !== "string" || surveyId.trim() === "") {
    return res.status(400).json({
      error:
        "La identificación del encuesta es requerida y debe ser un texto válido.",
    });
  }

  // Buscar la encuesta por su ID
  const survey = await models.Survey.findByPk(surveyId);
  if (!survey) {
    return res.status(404).json({ message: "Encuesta no encontrada." });
  }

  // Crear el factor
  const factor = await models.Factor.create({
    name,
    description,
    surveyId,
  });

  return res.status(201).json({
    message: "Factor creado con éxito",
    factor,
  });
};

export const updateFactor = async (req, res) => {
  const { id } = req.params;
  const { name, description, position } = req.body;

  try {
    const factor = await models.Factor.findByPk(id);

    if (!factor) {
      return res.status(404).json({ message: "Factor no encontrado." });
    }

    if (name) {
      factor.name = name;
    }

    if (description) {
      factor.description = description;
    }

    if (position) {
      factor.position = position;
    }

    await factor.save();

    res.status(200).json({ message: "Factor actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el factor:", error);
    res.status(500).json({ message: "Error al actualizar el factor." });
  }
};

export const deleteFactor = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID del factor es obligatorio." });
  }

  const t = await sequelize.transaction();

  try {
    // 1. Buscar el factor
    const factor = await models.Factor.findByPk(id, { transaction: t });

    if (!factor) {
      await t.rollback();
      return res.status(404).json({ message: "Factor no encontrado." });
    }

    // 2. Buscar los dominios del factor
    const domains = await models.Domain.findAll({
      where: { factorId: id },
      transaction: t,
    });
    const domainIds = domains.map((dom) => dom.id);

    // 2. Buscar las dimensiones del factor
    const dimensions = await models.Dimension.findAll({
      where: { domainId: domainIds },
      transaction: t,
    });
    const dimensionIds = dimensions.map((dim) => dim.id);

    // 3. Buscar y eliminar las dimensiones del factor
    if (dimensionIds.length > 0) {
      await models.Dimension.destroy({
        where: {
          factorId: {
            [Op.in]: dimensionIds,
          },
        },
        transaction: t,
      });
    }

    // 4. Eliminar el factor
    await models.Factor.destroy({
      where: { id },
      transaction: t,
    });

    await t.commit();

    return res.status(200).json({ message: "Factor eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar el factor:", error);
    await t.rollback();
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const getFactorsByIdFactor = async (req, res) => {
  try {
    const { surveyId } = req.params;

    if (!surveyId || typeof surveyId !== "string" || surveyId.trim() === "") {
      return res.status(400).json({
        error:
          "La identificación del factor es requerida y debe ser un texto válido.",
      });
    }

    const factor = await models.Factor.findOne({ where: { surveyId } });

    if (!factor) {
      return res.status(404).json({ message: "Factor no encontrado." });
    }

    const domains = await models.Domain.findAll({
      where: { factorId: factor.id }, // ← corrección aquí
    });

    return res.status(200).json({
      message: "Factores obtenidos con éxito",
      domains,
    });
  } catch (error) {
    console.error("Error al obtener los factores:", error);
    return res.status(500).json({
      error: "Error interno del servidor al obtener los factores.",
    });
  }
};
