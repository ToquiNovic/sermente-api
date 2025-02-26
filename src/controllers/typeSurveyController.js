import { models } from "../database/conexion.js";

export const getTypeSurvey = async (req, res) => {
  const { id } = req.params;

  try {
    const typeSurvey = await models.TypeSurveys.findByPk(id);

    if (!typeSurvey) {
      return res.status(404).json({ message: "Type survey not found." });
    }

    res.status(200).json({ typeSurvey });
  } catch (error) {
    console.error("Error getting type survey:", error);
    res.status(500).json({ message: "Error getting type survey.", error });
  }
};

export const getAllTypeSurveys = async (req, res) => {
  try {
    const typeSurveys = await models.TypeSurveys.findAll({
      attributes: ["id", "name", "description", "state", "isPublic"],
    });

    res.status(200).json({ typeSurveys });
  } catch (error) {
    console.error("Error getting all type surveys:", error);
    res.status(500).json({ message: "Error getting all type surveys.", error });
  }
};

export const createTypeSurvey = async (req, res) => {
  const { name, description, state, isPublic } = req.body;

  try {
    const typeSurvey = await models.TypeSurveys.create({
      name,
      description,
      state,
      isPublic,
    });

    res.status(201).json({ message: "Type survey created successfully.", typeSurvey });
  } catch (error) {
    console.error("Error creating type survey:", error);
    res.status(500).json({ message: "Error creating type survey.", error });
  }
};

export const updateTypeSurvey = async (req, res) => {
  const { id } = req.params;
  const { name, description, state, isPublic } = req.body;

  try {
    const typeSurvey = await models.TypeSurveys.findByPk(id);

    if (!typeSurvey) {
      return res.status(404).json({ message: "Type survey not found." });
    }

    if (name) {
      typeSurvey.name = name;
    }

    if (description) {
      typeSurvey.description = description;
    }

    if (state) {
      typeSurvey.state = state;
    }

    if (isPublic) {
      typeSurvey.isPublic = isPublic;
    }

    await typeSurvey.save();

    res.status(200).json({ message: "Type survey updated successfully.", typeSurvey });
  } catch (error) {
    console.error("Error updating type survey:", error);
    res.status(500).json({ message: "Error updating type survey.", error });
  }
};

export const deleteTypeSurvey = async (req, res) => {
  const { id } = req.params;

  try {
    const typeSurvey = await models.TypeSurveys.findByPk(id);

    if (!typeSurvey) {
      return res.status(404).json({ message: "Type survey not found." });
    }

    await typeSurvey.destroy();

    res.status(200).json({ message: "Type survey deleted successfully." });
  } catch (error) {
    console.error("Error deleting type survey:", error);
    res.status(500).json({ message: "Error deleting type survey.", error });
  }
};

export const addSurveyToTypeSurvey = async (req, res) => {
  const { id, surveyId } = req.body;

  if (!surveyId) {
    return res.status(400).json({ message: "Survey ID is required." });
  }

  try {
    const typeSurvey = await models.TypeSurveys.findByPk(id);
    if (!typeSurvey) {
      return res.status(404).json({ message: "Type survey not found." });
    }

    const survey = await models.Survey.findByPk(surveyId);
    if (!survey) {
      return res.status(404).json({ message: "Survey not found." });
    }

    await typeSurvey.addSurvey(survey);

    res.status(200).json({ message: "Survey added successfully." });
  } catch (error) {
    console.error("Error adding survey to type survey:", error);
    res.status(500).json({ message: "Error adding survey to type survey.", error });
  }
};

export const removeSurveyFromTypeSurvey = async (req, res) => {
  const { id, surveyId } = req.body;

  if (!surveyId) {
    return res.status(400).json({ message: "Survey ID is required." });
  }

  try {
    const typeSurvey = await models.TypeSurveys.findByPk(id);
    if (!typeSurvey) {
      return res.status(404).json({ message: "Type survey not found." });
    }

    const survey = await models.Survey.findByPk(surveyId);
    if (!survey) {
      return res.status(404).json({ message: "Survey not found." });
    }

    await typeSurvey.removeSurvey(survey);

    res.status(200).json({ message: "Survey removed successfully." });
  } catch (error) {
    console.error("Error removing survey:", error);
    res.status(500).json({ message: "Error removing survey.", error });
  }
};