import { Router } from "express";
import {
  getTypeSurvey,
  getAllTypeSurveys,
  createTypeSurvey,
  updateTypeSurvey,
  deleteTypeSurvey,
  addSurveyToTypeSurvey,
  removeSurveyFromTypeSurvey,
} from "../controllers/typeSurveyController.js";

const router = Router();

router.get("/:id", getTypeSurvey);
router.get("/", getAllTypeSurveys);
router.post("/", createTypeSurvey);
router.put("/:id", updateTypeSurvey);
router.delete("/:id", deleteTypeSurvey);
router.post("/:id/survey", addSurveyToTypeSurvey);
router.delete("/:id/survey", removeSurveyFromTypeSurvey);

export default router;