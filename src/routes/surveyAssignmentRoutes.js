import { Router } from 'express';
import {
  assignSurveyToUser,
} from '../controllers/surveyAssignmentController.js';

const router = Router();

router.post('/:companyId', assignSurveyToUser);

export default router;