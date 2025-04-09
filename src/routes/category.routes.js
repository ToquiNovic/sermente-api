import { Router } from "express";
import { postCategory, getCategoriesbySurveyId, updateCategory, deleteCategory } from "../controllers/category.controller.js";

const router = Router();

router.post("/", postCategory);
router.get("/survey/:surveyId", getCategoriesbySurveyId);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;