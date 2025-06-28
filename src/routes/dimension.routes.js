// routes/dimension.routes.js
import express from "express";
import {
  getDimensionsByIdFactor,
  getDimensionByIdSurvey,
  createDimension,
  updateDimension,
  deleteDimension,
} from "../controllers/dimension.controller.js";

const router = express.Router();

router.get("/:id/factor", getDimensionsByIdFactor);
router.get("/survey/:surveyId", getDimensionByIdSurvey);
router.post("/", createDimension);
router.put("/:id", updateDimension);
router.delete("/:id", deleteDimension);

export default router;