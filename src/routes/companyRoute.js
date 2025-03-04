import { Router } from "express";
import { createCompany, getAllCompanies, deleteCompany } from "../controllers/companyController.js";

const router = Router();

router.post("/", createCompany);
router.get("/", getAllCompanies);
router.delete("/:id", deleteCompany);

export default router;