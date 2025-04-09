import { models, sequelize } from "../database/conexion.js";

export const createSurvey = async (req, res) => {
  const { id, title, description, categories, subcategories } = req.body;

  if (!id || !title) {
    return res.status(400).json({ message: "ID y título son obligatorios." });
  }

  const t = await sequelize.transaction();

  try {
    // 1. Crear la encuesta
    const survey = await models.Survey.create(
      { id, title, description },
      { transaction: t }
    );

    // 2. Crear categorías asociadas
    const createdCategories = await Promise.all(
      categories.map((cat) =>
        models.Category.create(
          {
            id: cat.id,
            name: cat.name,
            description: cat.description,
            surveyId: survey.id,
          },
          { transaction: t }
        )
      )
    );

    for (const cat of createdCategories) {
      const subs = subcategories?.[cat.id] || [];
      for (const sub of subs) {
        await models.SubCategory.create(
          {
            id: sub.id,
            name: sub.name,
            categoryId: cat.id,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    return res.status(201).json({
      message: "Encuesta creada exitosamente.",
      id: survey.id,
    });
  } catch (error) {
    await t.rollback();
    console.error("❌ Error creating survey with categories:", error);
    return res
      .status(500)
      .json({ message: "Error al crear la encuesta.", error });
  }
};

export const getSurvey = async (req, res) => {
  const { id } = req.params;

  try {
    const survey = await models.Survey.findByPk(id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found." });
    }

    res.status(200).json({ survey });
  } catch (error) {
    console.error("Error getting survey:", error);
    res.status(500).json({ message: "Error getting survey.", error });
  }
};

export const getAllSurveys = async (req, res) => {
  try {
    const surveys = await models.Survey.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ surveys });
  } catch (error) {
    console.error("Error getting all surveys:", error);
    res.status(500).json({ message: "Error getting all surveys.", error });
  }
};

export const updateSurvey = async (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, typeSurveyId } = req.body;

  try {
    const survey = await models.Survey.findByPk(id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found." });
    }

    if (title) {
      survey.title = title;
    }

    if (description) {
      survey.description = description;
    }

    if (deadline) {
      survey.deadline = deadline;
    }

    if (typeSurveyId) {
      survey.typeSurveyId = typeSurveyId;
    }

    await survey.save();

    res.status(200).json({ message: "Survey updated successfully.", survey });
  } catch (error) {
    console.error("Error updating survey:", error);
    res.status(500).json({ message: "Error updating survey.", error });
  }
};

export const deleteSurvey = async (req, res) => {
  const { id } = req.params;

  try {
    const survey = await models.Survey.findByPk(id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found." });
    }

    await survey.destroy();

    res.status(200).json({ message: "Survey deleted successfully." });
  } catch (error) {
    console.error("Error deleting survey:", error);
    res.status(500).json({ message: "Error deleting survey.", error });
  }
};

export const addDependencies = async (req, res) => {
  const { id, dependencies } = req.body;

  try {
    const survey = await models.Survey.findByPk(id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found." });
    }

    await survey.addDependencies(dependencies);

    res.status(200).json({ message: "Dependencies added successfully." });
  } catch (error) {
    console.error("Error adding dependencies:", error);
    res.status(500).json({ message: "Error adding dependencies.", error });
  }
};

export const removeDependencies = async (req, res) => {
  const { id, dependencies } = req.body;

  try {
    const survey = await models.Survey.findByPk(id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found." });
    }

    await survey.removeDependencies(dependencies);

    res.status(200).json({ message: "Dependencies removed successfully." });
  } catch (error) {
    console.error("Error removing dependencies:", error);
    res.status(500).json({ message: "Error removing dependencies.", error });
  }
};
