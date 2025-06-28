// controllers/dimension.controller.js
import { models, sequelize } from "../database/conexion.js";

export const getDimensionsByIdFactor = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    if (!id || typeof id !== "string" || id.trim() === "") {
      return res.status(400).json({
        error:
          "La identificación de la dimension es requerida y debe ser un texto válido.",
      });
    }

    const factor = await models.Factor.findByPk(id);

    if (!factor) {
      return res.status(404).json({ message: "Factor no encontrada." });
    }

    const dimensions = await models.Dimension.findAll({
      where: { factorId: id },
    });

    return res.status(200).json({
      message: "Dimensiones obtenidas con éxito",
      dimensions,
    });
  } catch (error) {
    console.error("Error al obtener las dimensiones:", error);
    return res.status(500).json({
      error: "Error interno del servidor al obtener las dimensiones.",
    });
  }
};

export const createDimension = async (req, res) => {
  const { name, domainId } = req.body;

  // Validar domainId
  if (!domainId || typeof domainId !== "string" || domainId.trim() === "") {
    return res.status(400).json({
      error:
        "La identificación de la dimension es requerida y debe ser un texto válido.",
    });
  }

  // Validar name
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error:
        "El nombre de la dimension es requerido y debe ser un texto válido.",
    });
  }

  // Buscar la dimension por su ID
  const domain = await models.Domain.findByPk(domainId);
  if (!domain) {
    return res.status(404).json({ message: "Dimension no encontrada." });
  }

  // Crear la dimension
  const dimension = await models.Dimension.create({
    name,
    domainId,
  });

  return res.status(201).json({
    message: "Dimension creada con éxito",
    dimension,
  });
};

export const updateDimension = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const dimension = await models.Dimension.findByPk(id);

    if (!dimension) {
      return res.status(404).json({ message: "Dimension no encontrada." });
    }

    if (name) {
      dimension.name = name;
    }

    await dimension.save();

    res.status(200).json({ message: "Dimension actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la dimension:", error);
    res.status(500).json({ message: "Error al actualizar la dimension." });
  }
};

export const deleteDimension = async (req, res) => {
  try {
    const { id } = req.params;

    const dimension = await models.Dimension.findByPk(id);

    if (!dimension) {
      return res.status(404).json({ message: "No se encontró la dimension" });
    }

    await dimension.destroy();

    res.status(200).json({ message: "Dimension eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la dimension:", error);
    res.status(500).json({ message: "Error al eliminar la dimension." });
  }
};

export const getDimensionByIdSurvey = async (req, res) => {
  const { surveyId } = req.params;
  try {
    if (!surveyId || typeof surveyId !== "string" || surveyId.trim() === "") {
      return res.status(400).json({
        error: "El Id de la encuesta es requerido",
      });
    }

    const survey = await models.Survey.findByPk(surveyId);
    if (!survey) {
      return res.status(404).json({ message: "Encuesta no encontrada." });
    }

    const factors = await models.Factor.findAll({
      where: { surveyId },
      attributes: ["id", "name", "description", "position"],
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
            },
          ],
        },
      ],
    });

    if (!factors || factors.length === 0) {
      return res.status(404).json({
        message: "No se encontraron factores para esta encuesta.",
      });
    }

    return res.status(200).json({
      message: "Dimensiones obtenidas con éxito",
      factors,
    });
  } catch (error) {
    console.error("Error al obtener las dimensiones:", error);
    return res.status(500).json({
      error: "Error interno del servidor al obtener las dimensiones.",
    });
  }
};