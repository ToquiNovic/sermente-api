import { Router } from "express";
import {
  getAllOptions,
  getOptionById,
  getOptionbyQuestionId,
  createOption,
  updateOption,
  deleteOption,
} from "../controllers/option.controller.js";

const router = Router();

router.get("/", getAllOptions);
router.get("/:id", getOptionById);
router.get("/question/:questionId", getOptionbyQuestionId);
router.post("/", createOption);
router.put("/:id", updateOption);
router.delete("/:id", deleteOption);

export default router;
