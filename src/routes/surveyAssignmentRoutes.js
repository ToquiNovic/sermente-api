import { Router } from 'express';
import {
  createUserWithPeople,
} from '../controllers/surveyAssignmentController.js';

const router = Router();

router.post('/', createUserWithPeople);

export default router;