// routes/subCategory.routes.js
import { Router } from "express";
import {
  getSubCategorysByIdCategory,
  getSubCategoryByIdSurvey,
  createSubCategory,
  updateSubCategory,
} from "../controllers/subCategory.controller.js";

const router = Router();

router.get("/:id/category", getSubCategorysByIdCategory);
router.get("/:id/survey", getSubCategoryByIdSurvey);
router.post("/", createSubCategory);
router.put("/:id", updateSubCategory);

export default router;