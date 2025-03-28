import { Router } from "express";
import { assignUsersToCompany } from "../controllers/userCompanyController.js";

const router = Router();

router.post("/:id/assign", assignUsersToCompany);

export default router;