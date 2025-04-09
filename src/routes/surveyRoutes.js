import { Router } from 'express';
import { createSurvey, getSurvey, getAllSurveys, updateSurvey, deleteSurvey } from '../controllers/surveyController.js';

const router = Router();

router.post('/', createSurvey);
router.get('/:id', getSurvey);
router.get('/', getAllSurveys);
router.put('/:id', updateSurvey);
router.delete('/:id', deleteSurvey);

export default router;