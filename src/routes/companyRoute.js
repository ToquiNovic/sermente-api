import { Router } from "express";
import {
  createCompany,
  getAllCompanies,
  deleteCompany,
  getSurveysByCompany,
  getCompanyById,
  updateCompany,
  getUsersByCompany,
} from "../controllers/companyController.js";
import { assignUsersToCompany } from "../controllers/userCompany.controller.js";

const router = Router();

router.post("/", createCompany);
router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);
router.get("/:id/surveys", getSurveysByCompany);
router.delete("/:id", deleteCompany);
router.post("/:id/assign", assignUsersToCompany);
router.patch("/:id", updateCompany);
router.post("/:id/users", getUsersByCompany);

export default router;