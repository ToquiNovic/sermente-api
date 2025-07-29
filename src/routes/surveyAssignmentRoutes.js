import { Router } from 'express';
import {
  assignUsersToSurvey,
} from '../controllers/surveyAssignmentController.js';

const router = Router();

router.post('/:companyId', assignUsersToSurvey);

export default router;