// controllers/category.controller.js
import { models, sequelize } from "../database/conexion.js";

export const postCategory = async (req, res) => {
  try {
    const { name, description, surveyId } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        error:
          "El nombre de la categoría es requerido y debe ser un texto válido.",
      });
    }

    if (!surveyId || typeof surveyId !== "string" || surveyId.trim() === "") {
      return res.status(400).json({
        error:
          "La identificación de la encuesta es requerida y debe ser un texto válido.",
      });
    }

    const category = await models.Category.create({
      name,
      description,
      surveyId,
    });

    return res.status(201).json({
      message: "Categoría creada con éxito",
      category,
    });
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al crear la categoría." });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await models.Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    if (name) {
      category.name = name;
    }

    if (description) {
      category.description = description;
    }

    await category.save();

    res
      .status(200)
      .json({ message: "Category updated successfully.", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error updating category.", error });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ message: "ID de la categoría es obligatorio." });
  }

  const t = await sequelize.transaction();

  try {
    // 1. Buscar la categoría
    const category = await models.Category.findByPk(id, { transaction: t });

    if (!category) {
      await t.rollback();
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    // 2. Buscar las subcategorías de esa categoría
    const subcategories = await models.SubCategory.findAll({
      where: { categoryId: id },
      transaction: t,
    });
    const subcategoryIds = subcategories.map((cat) => cat.id);

    // 3. Buscar y eliminar las subcategorías de esas categorías
    if (subcategoryIds.length > 0) {
      await models.SubCategory.destroy({
        where: {
          categoryId: {
            [Op.in]: subcategoryIds,
          },
        },
        transaction: t,
      });
    }

    // 4. Eliminar las categorías
    await models.Category.destroy({
      where: { id },
      transaction: t,
    });

    await t.commit();

    return res
      .status(200)
      .json({ message: "Categoría eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    await t.rollback();
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const getCategoriesbySurveyId = async (req, res) => {
  try {
    const { surveyId } = req.params;

    if (!surveyId || typeof surveyId !== "string" || surveyId.trim() === "") {
      return res.status(400).json({
        error:
          "La identificación de la encuesta es requerida y debe ser un texto válido.",
      });
    }

    const categories = await models.Category.findAll({
      where: {
        surveyId,
      },
    });

    return res.status(200).json({
      message: "Categorías obtenidas con éxito",
      categories,
    });
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al obtener las categorías." });
  }
};
