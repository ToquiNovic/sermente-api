// controllers/userController.controller.js
import { models, sequelize } from "../database/conexion.js";

export const getSubCategorysByIdCategory = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    if (!id || typeof id !== "string" || id.trim() === "") {
      return res.status(400).json({
        error:
          "La identificación de la categoría es requerida y debe ser un texto válido.",
      });
    }

    const category = await models.Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    const subcategories = await models.SubCategory.findAll({
      where: { categoryId: id },
    });

    return res.status(200).json({
      message: "Categorías obtenidas con éxito",
      subcategories,
    });
  } catch (error) {
    console.error("Error al obtener las subcategorías:", error);
    return res.status(500).json({
      error: "Error interno del servidor al obtener las subcategorías.",
    });
  }
};

export const getSubCategoryByIdSurvey = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string" || id.trim() === "") {
      return res.status(400).json({
        error:
          "La identificación de la encuesta es requerida y debe ser un texto válido.",
      });
    }

    const survey = await models.Survey.findByPk(id);
    if (!survey) {
      return res.status(404).json({ message: "Encuesta no encontrada." });
    }

    const categories = await models.Category.findAll({
      where: { surveyId: id },
    });

    if (!categories || categories.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron categorías para esta encuesta." });
    }

    const response = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await models.SubCategory.findAll({
          where: { categoryId: category.id },
          attributes: ["id", "name"],
        });

        return {
          idcategory: category.id,
          namecategory: category.name,
          subcategories: subcategories.map((sub) => ({
            id: sub.id,
            name: sub.name,
          })),
        };
      })
    );

    return res.status(200).json({
      message: "Subcategorías obtenidas con éxito",
      data: response,
    });
  } catch (error) {
    console.error("Error al obtener las subcategorías:", error);
    return res.status(500).json({
      error: "Error interno del servidor al obtener las subcategorías.",
    });
  }
};

export const createSubCategory = async (req, res) => {
  const { categoryId, name } = req.body; 

  // Validar categoryId
  if (
    !categoryId ||
    typeof categoryId !== "string" ||
    categoryId.trim() === ""
  ) {
    return res.status(400).json({
      error:
        "La identificación de la categoría es requerida y debe ser un texto válido.",
    });
  }

  // Validar name
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error:
        "El nombre de la subcategoría es requerido y debe ser un texto válido.",
    });
  }

  // Buscar la categoría por su ID
  const category = await models.Category.findByPk(categoryId);
  if (!category) {
    return res.status(404).json({ message: "Categoría no encontrada." });
  }

  // Crear la subcategoría
  const subcategory = await models.SubCategory.create({
    name,
    categoryId, 
  });

  return res.status(201).json({
    message: "Subcategoría creada con éxito",
    subcategory,
  });
};

export const updateSubCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const subcategory = await models.SubCategory.findByPk(id);

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategoría no encontrada." });
    }

    if (name) {
      subcategory.name = name;
    }

    await subcategory.save();

    res.status(200).json({ message: "Subcategoría actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la subcategoría:", error);
    res.status(500).json({ message: "Error al actualizar la subcategoría." });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subcategory = await models.SubCategory.findByPk(id);

    if (!subcategory) {
      return res.status(404).json({ message: "No se encontró la subcategoría" });
    }

    await subcategory.destroy();

    res.status(200).json({ message: "Subcategoría eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la subcategoría:", error);
    res.status(500).json({ message: "Error al eliminar la subcategoría." });
  }
};