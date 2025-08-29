import { Router } from "express";
import * as answerOptionController from "../controllers/answerOption.controller.js";

const router = Router();

// GET routes
router.get("/", answerOptionController.getAllAnswerOptions);
router.get("/:id", answerOptionController.getAnswerOptionById);
router.get("/user/:userCompanyId", answerOptionController.getAnswerOptionsByUserCompanyId);
router.get("/option/:optionId", answerOptionController.getAnswerOptionsByOptionId);

// POST routes
router.post("/", answerOptionController.createAnswerOption);
router.post("/multiple", answerOptionController.createMultipleAnswerOptions);

// PUT routes
router.put("/:id", answerOptionController.updateAnswerOption);

// DELETE routes
router.delete("/:id", answerOptionController.deleteAnswerOption);
router.delete("/user/:userCompanyId", answerOptionController.deleteAnswerOptionsByUser);

export default router;