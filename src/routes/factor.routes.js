import { Router } from "express";
import { postFactor, getFactorsByIdFactor, updateFactor, deleteFactor } from "../controllers/factor.controller.js";

const router = Router();

router.post("/", postFactor);
router.get("/survey/:surveyId", getFactorsByIdFactor);
router.put("/:id", updateFactor);
router.delete("/:id", deleteFactor);

export default router;