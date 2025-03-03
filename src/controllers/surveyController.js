import { models } from "../database/conexion.js";

export const createSurvey = async (req, res) => {
  const { title, description, deadline, typeSurveyId, createdBy } = req.body;

  try {
    // Verificar si el tipo de encuesta es válido
    const typeSurvey = await models.TypeSurveys.findByPk(typeSurveyId);
    if (!typeSurvey) {
      return res.status(400).json({ message: "Invalid type survey." });
    }

    if (!createdBy) {
      return res.status(400).json({ message: "User ID (createdBy) is required." });
    }

    let survey = await models.Survey.create({
      title,
      description,
      deadline,
      typeSurveyId,
      createdBy,
    });

    res.status(201).json({ message: "Survey created successfully.", survey });
  } catch (error) {
    console.error("Error creating survey:", error);
    res.status(500).json({ message: "Error creating survey.", error });
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
      attributes: ["id", "title", "description", "deadline", "createdAt"],
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: models.TypeSurveys,
          as: "typeSurvey",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: models.User,
          as: "creator",
          attributes: ["id", "numberDoc"],
        }
      ],
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