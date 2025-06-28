// controllers/domain.controller.js
import { models, sequelize } from "../database/conexion.js";

export const postDomain = async (req, res) => {
  const { name, description, factorId } = req.body;

  // Validar factorId
  if (!factorId || typeof factorId !== "string" || factorId.trim() === "") {
    return res.status(400).json({
      error:
        "La identificación del factor es requerida y debe ser un texto válido.",
    });
  }

  // Validar name
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error:
        "El nombre del dominio es requerido y debe ser un texto válido.",
    });
  }

  // Buscar el factor por su ID
  const factor = await models.Factor.findByPk(factorId);
  if (!factor) {
    return res.status(404).json({ message: "Factor no encontrado." });
  }

  // Crear el dominio
  const domain = await models.Domain.create({
    name,
    description,
    factorId,
  });

  return res.status(201).json({
    message: "Dominio creado con éxito",
    domain,
  });
};

export const updateDomain = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const domain = await models.Domain.findByPk(id);

    if (!domain) {
      return res.status(404).json({ message: "Domain not found." });
    }

    if (name) {
      domain.name = name;
    }

    if (description) {
      domain.description = description;
    }

    await domain.save();

    res
      .status(200)
      .json({ message: "Domain updated successfully.", domain });
  } catch (error) {
    console.error("Error updating domain:", error);
    res.status(500).json({ message: "Error updating domain.", error });
  }
};

export const deleteDomain = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ message: "ID del dominio es obligatorio." });
  }

  const t = await sequelize.transaction();

  try {
    // 1. Buscar el dominio
    const domain = await models.Domain.findByPk(id, { transaction: t });

    if (!domain) {
      await t.rollback();
      return res.status(404).json({ message: "Dominio no encontrado." });
    }

    // 2. Buscar las dimensiones del dominio
    const dimensions = await models.Dimension.findAll({
      where: { domainId: id },
      transaction: t,
    });
    const dimensionIds = dimensions.map((dim) => dim.id);

    // 3. Buscar y eliminar las dimensiones del dominio
    if (dimensionIds.length > 0) {
      await models.Dimension.destroy({
        where: {
          domainId: {
            [Op.in]: dimensionIds,
          },
        },
        transaction: t,
      });
    }

    // 4. Eliminar el dominio
    await models.Domain.destroy({
      where: { id },
      transaction: t,
    });

    await t.commit();

    return res
      .status(200)
      .json({ message: "Dominio eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar el dominio:", error);
    await t.rollback();
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const getDomainsByIdFactor = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    if (!id || typeof id !== "string" || id.trim() === "") {
      return res.status(400).json({
        error:
          "La identificación del factor es requerida y debe ser un texto válido.",
      });
    }

    const factor = await models.Factor.findByPk(id);

    if (!factor) {
      return res.status(404).json({ message: "Factor no encontrado." });
    }

    const domains = await models.Domain.findAll({
      where: { factorId: id },
    });

    return res.status(200).json({
      message: "Dominios obtenidos con éxito",
      domains,
    });
  } catch (error) {
    console.error("Error al obtener los dominios:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al obtener los dominios." });
  }
};

export const getDomainByIdSurvey = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string" || id.trim() === "") {
      return res.status(400).json({
        error:
          "La identificación del dominio es requerida y debe ser un texto válido.",
      });
    }

    const survey = await models.Survey.findByPk(id);
    if (!survey) {
      return res.status(404).json({ message: "Encuesta no encontrada." });
    } 

    const domains = await models.Domain.findAll({
      where: { surveyId: id },
    });

    if (!domains || domains.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron dominios para esta encuesta." });
    }

    const response = await Promise.all(
      domains.map(async (domain) => {
        const dimensions = await models.Dimension.findAll({
          where: { domainId: domain.id },
          attributes: ["id", "name"],
        });

        return {
          iddomain: domain.id,
          namedomain: domain.name,
          dimensions: dimensions.map((dimension) => ({
            id: dimension.id,
            name: dimension.name,
          })),
        };
      })
    );

    return res.status(200).json({
      message: "Dominios obtenidos con éxito",
      data: response,
    });
  } catch (error) {
    console.error("Error al obtener los dominios:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al obtener los dominios." });
  }
};