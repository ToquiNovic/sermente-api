import { Router } from "express";
import { createCompany, getAllCompanies, deleteCompany, getSurveysByCompany } from "../controllers/companyController.js";

const router = Router();

router.post("/", createCompany);
router.get("/", getAllCompanies);
router.get("/:id/surveys", getSurveysByCompany);
router.delete("/:id", deleteCompany);

export default router;