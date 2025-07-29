import { Router } from 'express';
import {
  assignUsersToSurvey,
  getSurveysAssignedByCompany,
  getSurveysAssignedByUser
} from '../controllers/surveyAssignmentController.js';

const router = Router();

router.get('/company/:companyId', getSurveysAssignedByCompany);
router.get('/user/:userId', getSurveysAssignedByUser);
router.post('/:companyId', assignUsersToSurvey);

export default router;