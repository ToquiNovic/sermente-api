// controllers/category.controller.js
import { models } from "../database/conexion";

export const postCategory = async (req, res) => {
  try {
    const { name, description, surveyId } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "El nombre de la categoría es requerido y debe ser un texto válido." });
    }

    if (!surveyId || typeof surveyId !== "string" || surveyId.trim() === "") {
      return res.status(400).json({ error: "La identificación de la encuesta es requerida y debe ser un texto válido." });
    }

    const category = await models.category.create({ name, description, surveyId });

    return res.status(201).json({
      message: "Categoría creada con éxito",
      category,
    });
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    return res.status(500).json({ error: "Error interno del servidor al crear la categoría." });
  }
};
