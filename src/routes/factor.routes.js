import { Router } from "express";
import { postFactor, getFactorsByIdSurvey, updateFactor, deleteFactor } from "../controllers/factor.controller.js";

const router = Router();

router.post("/", postFactor);
router.get("/survey/:surveyId", getFactorsByIdSurvey);
router.put("/:id", updateFactor);
router.delete("/:id", deleteFactor);

export default router;