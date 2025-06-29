// routes/question.routes.js
import express from "express";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionBySurveyId,
  updateQuestionPosition,
} from "../controllers/question.controller.js";

const router = express.Router();

router.get("/:dimensionId", getQuestions);
router.post("/", createQuestion);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);
router.get("/survey/:surveyId", getQuestionBySurveyId);
router.put("/position/:id", updateQuestionPosition);

export default router;
