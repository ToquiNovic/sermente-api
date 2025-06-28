import { Router } from "express";
import { postDomain, getDomainByIdSurvey, updateDomain, deleteDomain } from "../controllers/domain.controller.js";

const router = Router();

router.post("/", postDomain);
router.get("/survey/:surveyId", getDomainByIdSurvey);
router.put("/:id", updateDomain);
router.delete("/:id", deleteDomain);

export default router;