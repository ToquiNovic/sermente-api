import { Router } from "express";
import { postCategory } from "../controllers/category.controller";

const router = Router();

router.post("/", postCategory);

export default router;